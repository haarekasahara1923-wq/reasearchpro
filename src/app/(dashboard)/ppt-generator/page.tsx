"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Presentation,
    Loader2,
    Sparkles,
    Download,
    Monitor,
    Layout as LayoutIcon,
    CheckCircle2,
    FileText,
    ChevronRight,
    Search,
    Book
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import pptxgen from "pptxgenjs";
import jsPDF from "jspdf";

type PptType = "thesis" | "research";

export default function PptGeneratorPage() {
    const [topic, setTopic] = useState("");
    const [type, setType] = useState<PptType>("thesis");
    const [generating, setGenerating] = useState(false);
    const [slides, setSlides] = useState<any[]>([]);
    const [downloading, setDownloading] = useState<"pptx" | "pdf" | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("/api/projects");
                setProjects(res.data);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        fetchProjects();
    }, []);

    const onGenerate = async () => {
        if (!topic && !selectedProjectId) return;
        try {
            setGenerating(true);
            setSlides([]);

            const res = await axios.post("/api/ppt/generate", {
                topic: selectedProjectId ? "" : topic,
                pages: 10,
                type,
                projectId: selectedProjectId
            });
            setSlides(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const downloadPPTX = () => {
        if (slides.length === 0) return;
        setDownloading("pptx");

        const pres = new pptxgen();
        pres.layout = "LAYOUT_16x9";
        pres.author = "ResearchPro AI";
        pres.subject = topic;

        slides.forEach((slideData: any) => {
            const slide = pres.addSlide();
            slide.background = { fill: "F5F7FA" };

            // Title
            slide.addText(slideData.title, {
                x: 0.5, y: 0.5, w: "90%", h: 1,
                fontSize: 32, bold: true, color: "1e293b", fontFace: "Arial"
            });

            // Content
            slideData.content.forEach((bullet: string, idx: number) => {
                slide.addText(bullet, {
                    x: 0.5, y: 1.8 + (idx * 0.6), w: "90%",
                    fontSize: 18, color: "334155", bullet: true, fontFace: "Arial"
                });
            });

            // Footer
            slide.addText(`ResearchPro AI | ${type.toUpperCase()}`, {
                x: 0.5, y: 5.2, w: "90%", fontSize: 10, color: "94a3b8", italic: true
            });
        });

        pres.writeFile({ fileName: `${type}_presentation.pptx` }).then(() => {
            setTimeout(() => setDownloading(null), 2000);
        });
    };

    const downloadPDF = () => {
        if (slides.length === 0) return;
        setDownloading("pdf");

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [842, 595] // A4 landscape pts approx
        });

        slides.forEach((slide, index) => {
            if (index > 0) doc.addPage([842, 595], "landscape");

            // Background
            doc.setFillColor(245, 247, 250);
            doc.rect(0, 0, 842, 595, "F");

            // Header/Title
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(28);
            doc.setFont("helvetica", "bold");
            doc.text(slide.title, 40, 60);

            // Divider
            doc.setDrawColor(226, 232, 240);
            doc.line(40, 80, 802, 80);

            // Content
            doc.setTextColor(51, 65, 85);
            doc.setFontSize(16);
            doc.setFont("helvetica", "normal");

            slide.content.forEach((point: string, i: number) => {
                doc.text("• " + point, 50, 120 + (i * 30), { maxWidth: 742 });
            });

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`ResearchPro AI | Page ${index + 1} of ${slides.length}`, 40, 560);
        });

        doc.save(`${type}_presentation.pdf`);
        setTimeout(() => setDownloading(null), 2000);
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Presentation className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Presentation Designer</h1>
                </div>
                <p className="text-muted-foreground">
                    Convert your academic topic into professional slides for defense or publication.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel */}
                <Card className="lg:col-span-5 shadow-sm border-none bg-muted/5 flex flex-col h-fit">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Presentation Settings</CardTitle>
                                <CardDescription>Configure your slide generation.</CardDescription>
                            </div>
                            <div className="flex bg-background p-1 rounded-xl border shadow-sm scale-90">
                                <button
                                    onClick={() => setType("thesis")}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${type === "thesis" ? "bg-red-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
                                >
                                    Thesis
                                </button>
                                <button
                                    onClick={() => setType("research")}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${type === "research" ? "bg-red-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
                                >
                                    Research
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-x-2">
                                <Book className="w-3 h-3 text-red-500" /> Select Source Project
                            </label>
                            <select
                                className="w-full h-12 px-4 bg-background border rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all shadow-sm text-sm"
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                            >
                                <option value="">-- Use Custom Topic --</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        {!selectedProjectId && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-x-2">
                                    <Search className="w-3 h-3 text-red-500" /> Presentation Topic / Focus
                                </label>
                                <textarea
                                    className="w-full h-40 p-4 bg-background border rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all resize-none shadow-inner text-sm leading-relaxed"
                                    placeholder={type === "thesis" ? "e.g. Defense presentation for my dissertation on Quantum Cryptography..." : "e.g. Conference presentation summarizing my findings on renewable energy..."}
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        )}

                        {selectedProjectId && (
                            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 flex items-center gap-x-3 text-red-700 animate-in slide-in-from-top-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="text-xs font-bold font-serif italic">Presentation will be generated using your research data from "{projects.find(p => p.id === selectedProjectId)?.title}"</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border bg-background rounded-2xl flex items-center gap-x-3 border-red-500/20 shadow-sm transition-all hover:border-red-500/40">
                                <Monitor className="w-5 h-5 text-red-500" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">Format</p>
                                    <p className="text-xs font-bold text-slate-700">16:9 HD</p>
                                </div>
                            </div>
                            <div className="p-4 border bg-background rounded-2xl flex items-center gap-x-3 border-transparent">
                                <LayoutIcon className="w-5 h-5 text-slate-400" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">Style</p>
                                    <p className="text-xs font-bold text-slate-700">Professional</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-red-600 hover:bg-red-700 font-black rounded-xl shadow-lg shadow-red-500/20 text-md uppercase tracking-widest mt-4"
                            onClick={onGenerate}
                            disabled={generating || (!topic && !selectedProjectId)}
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    AI DESIGNING SLIDES...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-3" />
                                    GENERATE SLIDES
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Area */}
                <div className="lg:col-span-7 flex flex-col">
                    {slides.length > 0 ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <Card className="border-none shadow-xl bg-slate-900 text-white p-6 rounded-[2rem]">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-x-4">
                                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                                            <Presentation className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight">{slides.length} SLIDES CREATED</h2>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{type} Presentation Ready</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-x-3 w-full md:w-auto">
                                        <Button
                                            onClick={downloadPPTX}
                                            disabled={!!downloading}
                                            className="flex-1 md:flex-none h-11 bg-white text-black hover:bg-slate-100 rounded-xl font-bold border-none"
                                        >
                                            {downloading === "pptx" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                            .PPTX
                                        </Button>
                                        <Button
                                            onClick={downloadPDF}
                                            disabled={!!downloading}
                                            className="flex-1 md:flex-none h-11 bg-red-600 hover:bg-red-700 rounded-xl font-bold border-none"
                                        >
                                            {downloading === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                                            .PDF
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 gap-6 overflow-y-auto max-h-[700px] pr-4 custom-scrollbar pb-10">
                                {slides.map((slide, i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-10 h-10 text-red-500" />
                                        </div>
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                {i + 1}
                                            </span>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight transition-colors uppercase decoration-red-500/30 underline-offset-4 decoration-2 underline">{slide.title}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-6 rounded-2xl">
                                            {slide.content.map((point: string, j: number) => (
                                                <div key={j} className="text-sm text-slate-600 flex items-start gap-x-3 leading-relaxed">
                                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0 shadow-sm shadow-red-500/40" />
                                                    {point}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 min-h-[500px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 transition-all hover:bg-slate-50/50 group">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Presentation className="w-12 h-12 text-slate-200" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">AI Presentation Preview</h2>
                            <p className="text-sm text-slate-400 max-w-xs mt-2 font-medium">Your slides will appear here. Choose a topic and click "Generate" to start designing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

