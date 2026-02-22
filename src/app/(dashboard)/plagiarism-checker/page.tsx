"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2, FileCheck, AlertTriangle, CheckCircle2, Copy, Upload, Sparkles, Wand2, Type, Eraser, Search, Info, Download, FileText } from "lucide-react";
import { useState, useRef } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PlagiarismCheckerPage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");
    const [rephrasing, setRephrasing] = useState(false);
    const [checkingGrammar, setCheckingGrammar] = useState(false);
    const [aiRemedy, setAiRemedy] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"plag" | "grammar" | "remedy">("plag");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCheck = async () => {
        if (!text || text.length < 50) {
            setError("Please enter at least 50 characters for a reliable check.");
            return;
        }
        setLoading(true);
        setError("");
        setResults(null);
        setAiRemedy(null);

        try {
            const response = await axios.post("/api/plagiarism/check", { text });
            setResults(response.data);
            setActiveTab("plag");
        } catch (err) {
            console.error(err);
            setError("Check failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("/api/extract-text", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data?.text) {
                setText(response.data.text);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to extract text from file. Please ensure it's a valid PDF, DOCX, or TXT file.");
        } finally {
            setLoading(false);
        }
    };

    const downloadAsPDF = () => {
        if (!text) return;
        setIsExporting(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const textWidth = pageWidth - (margin * 2);

            doc.setFontSize(16);
            doc.text("Plagiarism Check Result", margin, 20);

            doc.setFontSize(10);
            const lines = doc.splitTextToSize(text, textWidth);
            doc.text(lines, margin, 40);

            doc.save("ResearchPro_Scan_Result.pdf");
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    const downloadAsDOCX = async () => {
        if (!text) return;
        setIsExporting(true);
        try {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "Plagiarism Check Result",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: text,
                                    size: 24,
                                }),
                            ],
                            spacing: { before: 400 },
                        }),
                    ],
                }],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, "ResearchPro_Scan_Result.docx");
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleRephrase = async () => {
        if (!text) return;
        setRephrasing(true);
        setActiveTab("remedy");
        try {
            const response = await axios.post("/api/ai/write", {
                topic: "Rephrase for Plagiarism Removal",
                currentContent: text,
                instructions: "Rewrite the following text to remove plagiarism while keeping the academic meaning intact and professional."
            });
            setAiRemedy(response.data.content);
        } catch (err) {
            console.error(err);
        } finally {
            setRephrasing(false);
        }
    };

    const handleGrammarCheck = async () => {
        if (!text) return;
        setCheckingGrammar(true);
        setActiveTab("remedy");
        try {
            const response = await axios.post("/api/ai/write", {
                topic: "Grammar and Punctuation Fix",
                currentContent: text,
                instructions: "Act as a professional academic editor. Fix all grammar, spelling, and punctuation errors in this text. Provide the corrected version."
            });
            setAiRemedy(response.data.content);
        } catch (err) {
            console.error(err);
        } finally {
            setCheckingGrammar(false);
        }
    };

    const applyRemedy = () => {
        if (aiRemedy) {
            setText(aiRemedy);
            setAiRemedy(null);
            setActiveTab("plag");
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2 text-emerald-600">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Advanced Plagiarism & Grammar Suite</h1>
                </div>
                <p className="text-muted-foreground">
                    Scan for similarity, fix grammar errors, and rephrase with AI in one place.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-sm border-none bg-muted/5 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Content Input</CardTitle>
                            <CardDescription>Paste your thesis or upload a document (PDF, DOCX, TXT).</CardDescription>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={onFileUpload}
                                accept=".txt,.docx,.pdf"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload File
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" disabled={!text || isExporting}>
                                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                                        Export Result
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={downloadAsPDF}>
                                        Download as PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={downloadAsDOCX}>
                                        Download as DOCX (Word)
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setText(""); setResults(null); setAiRemedy(null); }}
                                className="text-muted-foreground"
                            >
                                <Eraser className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <textarea
                            className="w-full h-[500px] p-4 bg-background border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none text-sm leading-relaxed font-serif"
                            placeholder="Paste your research text here (min 50 chars)..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8"
                                onClick={onCheck}
                                disabled={loading || !text}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <FileCheck className="w-4 h-4 mr-2" />
                                        Check Plagiarism
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                className="h-11 border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={handleGrammarCheck}
                                disabled={checkingGrammar || !text}
                            >
                                {checkingGrammar ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Type className="w-4 h-4 mr-2" />}
                                Fix Grammar & Spellings
                            </Button>

                            <Button
                                variant="outline"
                                className="h-11 border-violet-200 text-violet-700 hover:bg-violet-50"
                                onClick={handleRephrase}
                                disabled={rephrasing || !text}
                            >
                                {rephrasing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                AI Rephrase (Remove Plag)
                            </Button>
                        </div>
                        {error && <p className="text-xs text-destructive bg-destructive/5 p-2 rounded">{error}</p>}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Tabs / Analysis Panel */}
                    <Card className="shadow-sm border-none bg-background overflow-hidden h-full">
                        <div className="flex border-b">
                            {[
                                { id: "plag", label: "Analysis", icon: Search },
                                { id: "remedy", label: "AI Remedy", icon: Sparkles }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 flex items-center justify-center gap-x-2 py-4 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50/10' : 'text-muted-foreground hover:bg-muted/30'}`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <CardContent className="p-6">
                            {activeTab === "plag" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    {results ? (
                                        <div className="space-y-8">
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-8 ${results.score > 20 ? 'border-rose-100 text-rose-500' : 'border-emerald-100 text-emerald-500'}`}>
                                                    <span className="text-3xl font-black">{results.score}%</span>
                                                    <div className={`absolute -bottom-2 px-3 py-1 rounded-full text-[10px] font-bold text-white ${results.score > 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                                                        {results.score > 20 ? 'High Risk' : 'Healthy'}
                                                    </div>
                                                </div>
                                                <p className="text-xs font-bold uppercase text-muted-foreground mt-6 tracking-widest">Similarity Score</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-muted/20 rounded-2xl flex flex-col items-center">
                                                    <p className="text-lg font-black">{100 - results.score}%</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Unique</p>
                                                </div>
                                                <div className="p-4 bg-muted/20 rounded-2xl flex flex-col items-center">
                                                    <p className="text-lg font-black">{results.aiProbability}%</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">AI Content</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold uppercase text-muted-foreground">Detailed Sources</p>
                                                    <Info className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    {results.sources?.map((s: any, i: number) => (
                                                        <div key={i} className="group flex items-center justify-between p-3 border rounded-xl text-xs hover:border-emerald-500/50 transition-all cursor-pointer">
                                                            <div className="flex flex-col gap-y-1">
                                                                <span className="truncate max-w-[150px] font-bold">{s.title}</span>
                                                                <span className="text-[10px] text-muted-foreground group-hover:text-emerald-600">View source article</span>
                                                            </div>
                                                            <span className="text-rose-500 font-black bg-rose-50 px-2 py-1 rounded-lg">{s.match}%</span>
                                                        </div>
                                                    ))}
                                                    {(!results.sources || results.sources.length === 0) && (
                                                        <div className="text-center py-6 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
                                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                                            <p className="text-[10px] text-emerald-800 font-medium">No major similarity sources found.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-32 flex flex-col items-center text-center space-y-4 opacity-30">
                                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                                                <ShieldCheck className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold">Waiting for Scan</p>
                                                <p className="text-xs">Paste your text and click check.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "remedy" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                        <div className="flex items-center gap-x-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-primary" />
                                            <p className="text-xs font-bold uppercase text-primary">AI Remedy Results</p>
                                        </div>

                                        {aiRemedy ? (
                                            <div className="space-y-4">
                                                <div className="bg-background border rounded-xl p-4 text-xs leading-relaxed max-h-[400px] overflow-y-auto font-serif">
                                                    {aiRemedy}
                                                </div>
                                                <Button
                                                    className="w-full bg-primary hover:bg-primary/90"
                                                    size="sm"
                                                    onClick={applyRemedy}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Apply to Editor
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="py-20 flex flex-col items-center text-center space-y-4 opacity-40">
                                                {rephrasing || checkingGrammar ? (
                                                    <div className="flex flex-col items-center gap-y-3">
                                                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                                        <p className="text-xs font-medium">AI is refining your content...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-10 h-10 text-primary" />
                                                        <p className="text-xs">Use "Fix Grammar" or "AI Rephrase" to see suggestions here.</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                        <p className="text-[10px] font-black text-blue-800 uppercase mb-1">Editor's Note</p>
                                        <p className="text-[11px] text-blue-700 leading-relaxed italic">
                                            "Our AI remedy maintains the academic integrity of your work while strictly addressing similarity issues."
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
