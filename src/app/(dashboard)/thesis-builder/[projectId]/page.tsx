"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Save, Send, Sparkles, LayoutTemplate, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

interface Section {
    id: string;
    title: string;
    content: string;
}

interface Project {
    id: string;
    title: string;
    type: string;
    field: string;
    degreeLevel: string;
    sections: Section[];
}

export default function ProjectEditorPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<Section | null>(null);
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [aiInstructions, setAiInstructions] = useState("");
    const [generateError, setGenerateError] = useState("");
    const [generateSuccess, setGenerateSuccess] = useState(false);

    // Smart Structure state
    const [showStructurePanel, setShowStructurePanel] = useState(false);
    const [rawContent, setRawContent] = useState("");
    const [structuring, setStructuring] = useState(false);
    const [structureError, setStructureError] = useState("");
    const [structureSuccess, setStructureSuccess] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/projects/${projectId}`);
                setProject(response.data);
                if (response.data.sections.length > 0) {
                    setActiveSection(response.data.sections[0]);
                    setContent(response.data.sections[0].content);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (projectId) fetchProject();
    }, [projectId]);

    const handleSave = async () => {
        if (!activeSection) return;
        setSaving(true);
        try {
            await axios.patch(`/api/projects/${projectId}`, {
                sectionId: activeSection.id,
                content: content
            });
            setProject(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    sections: prev.sections.map(s => s.id === activeSection.id ? { ...s, content } : s)
                };
            });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const generateSection = async () => {
        if (!project || !activeSection) return;
        setGenerating(true);
        setGenerateError("");
        setGenerateSuccess(false);
        try {
            const response = await axios.post("/api/ai/write", {
                topic: project.title,
                sectionTitle: activeSection.title,
                currentContent: content,
                field: project.field,
                degreeLevel: project.degreeLevel,
                instructions: aiInstructions
            });
            setContent(response.data.content);
            setGenerateSuccess(true);
            setTimeout(() => setGenerateSuccess(false), 3000);
        } catch (error: any) {
            console.error(error);
            const errMsg = error?.response?.data?.error || error?.response?.data || "AI generation failed. Please check that API keys (GROQ_API_KEY / GEMINI_API_KEY / OPENAI_API_KEY) are configured in your .env file.";
            setGenerateError(typeof errMsg === 'string' ? errMsg : "AI generation failed. Please check API keys in .env file.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSmartStructure = async () => {
        if (!project || !rawContent.trim()) return;
        setStructuring(true);
        setStructureError("");
        setStructureSuccess(false);
        try {
            const response = await axios.post("/api/ai/structure", {
                content: rawContent,
                type: project.type,
            });

            const { sections: aiSections } = response.data;

            // Match AI sections to project sections and update each
            const updatePromises = project.sections.map(async (projectSection) => {
                const aiSection = aiSections.find(
                    (s: any) => s.title.toLowerCase().trim() === projectSection.title.toLowerCase().trim()
                );
                if (aiSection && aiSection.content) {
                    await axios.patch(`/api/projects/${projectId}`, {
                        sectionId: projectSection.id,
                        content: aiSection.content,
                    });
                    return { ...projectSection, content: aiSection.content };
                }
                return projectSection;
            });

            const updatedSections = await Promise.all(updatePromises);

            setProject(prev => prev ? { ...prev, sections: updatedSections } : null);

            // Update active section content if it was updated
            if (activeSection) {
                const updated = updatedSections.find(s => s.id === activeSection.id);
                if (updated) {
                    setActiveSection(updated);
                    setContent(updated.content);
                }
            }

            setStructureSuccess(true);
            setTimeout(() => {
                setStructureSuccess(false);
                setShowStructurePanel(false);
                setRawContent("");
            }, 2500);
        } catch (error: any) {
            console.error(error);
            const errMsg = error?.response?.data?.error || error?.response?.data?.message || "Structuring failed. Please check API keys in .env file.";
            setStructureError(typeof errMsg === 'string' ? errMsg : "Structuring failed. Please try again.");
        } finally {
            setStructuring(false);
        }
    };

    const exportToPDF = () => {
        if (!project) return;
        const doc = new jsPDF();
        let yOffset = 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        const titleLines = doc.splitTextToSize(project.title, 160);
        doc.text(titleLines, 105, 100, { align: "center" });

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text(`Research Field: ${project.field}`, 105, 140, { align: "center" });
        doc.text(`Level: ${project.degreeLevel}`, 105, 150, { align: "center" });

        doc.addPage();
        yOffset = 20;

        project.sections.forEach((section) => {
            if (yOffset > 240) {
                doc.addPage();
                yOffset = 20;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text(section.title, 20, yOffset);
            yOffset += 12;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(section.content || "Pending research content...", 170);

            lines.forEach((line: string) => {
                if (yOffset > 280) {
                    doc.addPage();
                    yOffset = 20;
                }
                doc.text(line, 20, yOffset);
                yOffset += 7;
            });

            yOffset += 10;
        });

        doc.save(`${project.title.replace(/\s+/g, '_')}.pdf`);
    };

    const exportToDOCX = async () => {
        if (!project) return;

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: project.title,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    new Paragraph({
                        text: `Field: ${project.field}`,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Level: ${project.degreeLevel}`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 800 },
                    }),
                    ...project.sections.flatMap((section) => [
                        new Paragraph({
                            text: section.title,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 400, after: 200 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(section.content || "Pending research content..."),
                            ],
                            spacing: { after: 200 },
                        }),
                    ]),
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${project.title.replace(/\s+/g, '_')}.docx`);
    };

    if (loading) {
        return <div className="flex bg-background h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>;
    }

    if (!project) return <div>Project not found</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="border-b bg-background p-4 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Link href="/thesis-builder">
                        <Button variant="ghost" size="sm">Back</Button>
                    </Link>
                    <div className="h-4 w-px bg-border mx-2" />
                    <h1 className="font-semibold text-lg line-clamp-1 max-w-[400px]">{project.title}</h1>
                </div>
                <div className="flex items-center gap-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setShowStructurePanel(true); setStructureError(""); setStructureSuccess(false); }}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                    >
                        <LayoutTemplate className="w-4 h-4 mr-2" />
                        Smart Structure
                    </Button>

                    <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm">
                                <Send className="w-4 h-4 mr-2" />
                                Export Thesis
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={exportToPDF}>
                                Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={exportToDOCX}>
                                Export as DOCX (Word)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Sections */}
                <div className="w-64 border-r bg-muted/30 overflow-y-auto p-4 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Thesis Structure</p>
                    {project.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => {
                                handleSave();
                                setActiveSection(section);
                                setContent(section.content);
                                setGenerateError("");
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition truncate ${activeSection?.id === section.id ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-background'}`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/5">
                    <Card className="max-w-4xl mx-auto min-h-[1000px] shadow-sm border-none md:border">
                        <CardHeader className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                    Section: {activeSection?.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {content.split(/\s+/).filter(Boolean).length} Words
                                </span>
                            </div>
                            <CardTitle className="text-3xl text-center pt-8">
                                {activeSection?.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full flex-1 min-h-[700px] p-8 md:p-12 resize-none bg-transparent focus:outline-none text-lg leading-relaxed placeholder:text-muted-foreground/20 border-none transition-all"
                                placeholder={`Start writing your ${activeSection?.title} here...`}
                                spellCheck="false"
                            />

                            {/* Error state */}
                            {generateError && !generating && (
                                <div className="p-6 border-t border-dashed border-red-200 bg-red-50/50 flex items-start gap-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-red-700">AI Generation Failed</p>
                                        <p className="text-xs text-red-600 mt-1">{generateError}</p>
                                        <p className="text-xs text-red-500 mt-2">Get a free API key: <a href="https://console.groq.com" target="_blank" className="underline font-semibold">groq.com</a> or <a href="https://aistudio.google.com" target="_blank" className="underline font-semibold">aistudio.google.com</a></p>
                                    </div>
                                </div>
                            )}

                            {/* Success state */}
                            {generateSuccess && (
                                <div className="p-4 border-t border-dashed border-green-200 bg-green-50/50 flex items-center gap-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <p className="text-sm font-semibold text-green-700">Section generated successfully!</p>
                                </div>
                            )}

                            {/* Action Placeholder when empty */}
                            {!content && !generating && !generateError && (
                                <div className="p-12 border-t border-dashed bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                                    <Sparkles className="w-10 h-10 text-slate-200" />
                                    <div className="text-center">
                                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Empty Section</p>
                                        <p className="text-xs text-slate-400">Type above or use the AI Assistant to generate content.</p>
                                    </div>
                                    <Button variant="outline" onClick={generateSection} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Fast Generate
                                    </Button>
                                </div>
                            )}

                            {generating && (
                                <div className="p-12 border-t border-dashed bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-900 animate-pulse">AI is Researching...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* AI Assistant Panel */}
                <div className="w-80 border-l bg-muted/10 p-6 space-y-6">
                    <div className="flex items-center gap-x-2">
                        <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
                        <h2 className="font-semibold">Writing Assistant</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-background rounded-xl p-4 border shadow-sm space-y-3">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Instructions for AI</Label>
                            <textarea
                                value={aiInstructions}
                                onChange={(e) => setAiInstructions(e.target.value)}
                                className="w-full h-32 bg-muted/30 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary border-none transition-all"
                                placeholder="e.g. Write a literature review focusing on blockchain security in 2024..."
                            />
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={generateSection}
                                disabled={generating || !activeSection}
                            >
                                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {content ? "Improve with AI" : "Generate with AI"}
                            </Button>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 space-y-2">
                            <p className="text-[10px] font-bold text-purple-700 uppercase">💡 Smart Structure</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Have raw content? Use the <strong>Smart Structure</strong> button in the top bar to paste your content and let AI organize it into all sections automatically.
                            </p>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 space-y-2">
                            <p className="text-[10px] font-bold text-primary uppercase">Pro Tip</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Be specific with instructions. Mention key authors, years, or methodologies you want the AI to include in this section.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Structure Modal */}
            {showStructurePanel && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex items-start justify-between border-b">
                            <div>
                                <div className="flex items-center gap-x-3 mb-2">
                                    <div className="p-2 bg-purple-100 rounded-xl">
                                        <LayoutTemplate className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Smart Structure</h2>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">
                                    Paste your raw thesis, synopsis, or any research content below. AI will automatically extract and organize it into <strong>{project.sections.length} structured sections</strong>.
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowStructurePanel(false); setStructureError(""); setStructureSuccess(false); }}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors ml-4 shrink-0"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-1">
                                <p className="text-xs font-black text-purple-700 uppercase tracking-wider">Sections that will be filled:</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.sections.map(s => (
                                        <span key={s.id} className="text-[10px] font-bold bg-white border border-purple-200 text-purple-700 px-3 py-1 rounded-full">
                                            {s.title}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Your Raw Content</label>
                                <textarea
                                    value={rawContent}
                                    onChange={(e) => setRawContent(e.target.value)}
                                    className="w-full h-64 bg-slate-50 border-2 border-slate-200 focus:border-purple-400 focus:outline-none rounded-2xl p-5 text-sm text-slate-700 leading-relaxed resize-none transition-colors"
                                    placeholder="Paste your entire thesis draft, synopsis, notes, or any research content here...

Example:
This research investigates the impact of machine learning on healthcare diagnostics. The problem is that current diagnostic methods are slow and inaccurate. Our methodology involves training a CNN model on 50,000 medical images. We expect to achieve 95% accuracy..."
                                />
                                <p className="text-xs text-slate-400">{rawContent.length} characters · {rawContent.split(/\s+/).filter(Boolean).length} words</p>
                            </div>

                            {structureError && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-red-700">Structuring Failed</p>
                                        <p className="text-xs text-red-600 mt-1">{structureError}</p>
                                        <p className="text-xs text-red-500 mt-2">Make sure your API keys are set in .env: <span className="font-mono font-bold">GEMINI_API_KEY</span> or <span className="font-mono font-bold">GROQ_API_KEY</span></p>
                                    </div>
                                </div>
                            )}

                            {structureSuccess && (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-x-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="text-sm font-bold text-green-700">All sections structured successfully!</p>
                                        <p className="text-xs text-green-600 mt-1">Your content has been organized and saved to all sections.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pt-0 border-t flex gap-4">
                            <Button
                                variant="ghost"
                                className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-sm"
                                onClick={() => { setShowStructurePanel(false); setStructureError(""); }}
                                disabled={structuring}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-[2] h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl disabled:opacity-40"
                                onClick={handleSmartStructure}
                                disabled={structuring || !rawContent.trim() || structureSuccess}
                            >
                                {structuring ? (
                                    <span className="flex items-center gap-x-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        AI is Structuring...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-x-2">
                                        <LayoutTemplate className="w-5 h-5" />
                                        Structure Content
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
