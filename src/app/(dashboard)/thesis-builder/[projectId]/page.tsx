"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Save, Send, Sparkles } from "lucide-react";
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
            // Update local state
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
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const exportToPDF = () => {
        if (!project) return;
        const doc = new jsPDF();
        let yOffset = 20;

        // Cover Page
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
            // New page for each major section if it doesn't fit
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

            // Handle multiple pages for long content
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
                        <CardContent className="p-4 md:p-12">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[600px] resize-none bg-transparent prose dark:prose-invert focus:outline-none text-lg leading-relaxed placeholder:text-muted-foreground/30"
                                placeholder={`Start writing your ${activeSection?.title} here...`}
                            />

                            {!content && !generating && (
                                <div className="flex flex-col items-center justify-center py-20 border-t border-dashed mt-10 space-y-4">
                                    <Sparkles className="w-10 h-10 text-primary/20" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Empty Section</p>
                                        <p className="text-xs text-muted-foreground">Get started by using the AI Assistant on the right.</p>
                                    </div>
                                    <Button variant="outline" onClick={generateSection} className="gap-x-2">
                                        <Sparkles className="w-4 h-4" />
                                        Fast Generate Section
                                    </Button>
                                </div>
                            )}

                            {generating && (
                                <div className="flex flex-col items-center justify-center py-20 border-t border-dashed mt-10 space-y-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                    <p className="text-sm animate-pulse">AI is writing your {activeSection?.title}...</p>
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

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 space-y-2">
                            <p className="text-[10px] font-bold text-primary uppercase">Pro Tip</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Be specific with instructions. Mentions key authors, years, or methodologies you want the AI to include in this section.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
