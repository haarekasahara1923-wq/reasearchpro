"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    FileEdit,
    Loader2,
    Sparkles,
    Download,
    GraduationCap,
    BookText,
    User,
    School,
    Calendar,
    Award
} from "lucide-react";
import { useState, useRef } from "react";
import jsPDF from "jspdf";

type CoverType = "thesis" | "research";

export default function CoverDesignerPage() {
    const [type, setType] = useState<CoverType>("thesis");
    const [loading, setLoading] = useState(false);

    // Shared Fields
    const [title, setTitle] = useState("A Comprehensive Study on Artificial Intelligence in Modern Healthcare");
    const [author, setAuthor] = useState("John Doe");
    const [date, setDate] = useState("June 2024");

    // Thesis Specific
    const [university, setUniversity] = useState("Global Technical University");
    const [department, setDepartment] = useState("Department of Computer Science");
    const [supervisor, setSupervisor] = useState("Dr. Sarah Williams");
    const [rollNo, setRollNo] = useState("GTU-2024-089");

    // Research Specific
    const [journal, setJournal] = useState("International Journal of Advanced Research");
    const [affiliation, setAffiliation] = useState("School of Engineering, GTU");

    const coverRef = useRef<HTMLDivElement>(null);

    const downloadPDF = () => {
        const doc = new jsPDF("p", "pt", "a4");
        const element = coverRef.current;
        if (!element) return;

        setLoading(true);
        doc.html(element, {
            callback: function (doc) {
                doc.save(`${type}-cover-page.pdf`);
                setLoading(false);
            },
            x: 0,
            y: 0,
            width: 595, // A4 width in pts
            windowWidth: 800 // Scale to capture layout accurately
        });
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <FileEdit className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Cover Designer</h1>
                </div>
                <p className="text-muted-foreground">
                    Create professional APA/Official cover pages for your work.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor Panel */}
                <Card className="lg:col-span-5 shadow-sm border-none bg-muted/5 flex flex-col">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Document Details</CardTitle>
                                <CardDescription>Fill in the info for your cover page.</CardDescription>
                            </div>
                            <div className="flex bg-background p-1 rounded-xl border shadow-sm scale-90">
                                <button
                                    onClick={() => setType("thesis")}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${type === "thesis" ? "bg-yellow-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
                                >
                                    Thesis
                                </button>
                                <button
                                    onClick={() => setType("research")}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${type === "research" ? "bg-yellow-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
                                >
                                    Research Paper
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                <BookText className="w-3 h-3" /> {type === "thesis" ? "Thesis Title" : "Paper Title"}
                            </Label>
                            <textarea
                                className="w-full min-h-[80px] p-3 text-sm bg-background border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter full title..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                    <User className="w-3 h-3" /> Author Name
                                </Label>
                                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="rounded-xl h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                    <Calendar className="w-3 h-3" /> Date
                                </Label>
                                <Input value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl h-10" />
                            </div>
                        </div>

                        {type === "thesis" ? (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                        <School className="w-3 h-3" /> University Name
                                    </Label>
                                    <Input value={university} onChange={(e) => setUniversity(e.target.value)} className="rounded-xl h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                        <GraduationCap className="w-3 h-3" /> Department
                                    </Label>
                                    <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-xl h-10" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                            <Award className="w-3 h-3" /> Supervisor
                                        </Label>
                                        <Input value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="rounded-xl h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                            <FileEdit className="w-3 h-3" /> Roll / ID No.
                                        </Label>
                                        <Input value={rollNo} onChange={(e) => setRollNo(e.target.value)} className="rounded-xl h-10" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                        <School className="w-3 h-3" /> Journal Name
                                    </Label>
                                    <Input value={journal} onChange={(e) => setJournal(e.target.value)} className="rounded-xl h-10" placeholder="e.g. IEEE Transactions..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-x-2">
                                        <GraduationCap className="w-3 h-3" /> Author Affiliation
                                    </Label>
                                    <Input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="rounded-xl h-10" placeholder="e.g. Dept of Physics, University of..." />
                                </div>
                            </>
                        )}

                        <Button
                            className="w-full bg-yellow-600 hover:bg-yellow-700 h-12 rounded-xl mt-6 shadow-lg shadow-yellow-600/20 font-bold"
                            onClick={downloadPDF}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                            Download Cover Page (PDF)
                        </Button>
                    </CardContent>
                </Card>

                {/* Preview Area */}
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-4 px-2">
                        <Label className="font-bold text-sm">Real-time Preview</Label>
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">A4 FORMAT</span>
                    </div>

                    {/* The Actual Cover for PDF Export */}
                    <div className="w-full flex justify-center bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden">
                        <div
                            ref={coverRef}
                            className="bg-white shadow-2xl origin-top scale-[0.6] sm:scale-[0.8] md:scale-100"
                            style={{
                                width: "595px",
                                height: "842px",
                                color: "#1e293b",
                                fontFamily: "'Times New Roman', serif"
                            }}
                        >
                            {type === "thesis" ? (
                                <div className="h-full flex flex-col items-center justify-between p-16 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold uppercase tracking-widest">{university}</h2>
                                        <p className="text-sm font-semibold tracking-wide border-t border-b border-black/10 py-2">{department}</p>
                                    </div>

                                    <div className="py-20 w-4/5">
                                        <h1 className="text-3xl font-black uppercase mb-8 leading-tight tracking-tight decoration-yellow-500 underline underline-offset-8 decoration-4">
                                            {title || "YOUR THESIS TITLE HERE"}
                                        </h1>
                                        <p className="text-lg italic text-slate-500">A Dissertation submitted in partial fulfillment of the requirements for the degree of Bachelor of Technology</p>
                                    </div>

                                    <div className="grid grid-cols-2 w-full pt-10 border-t-2 border-slate-900/10">
                                        <div className="text-left space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Submitted By</p>
                                            <p className="text-lg font-bold">{author}</p>
                                            <p className="text-xs font-medium text-slate-500">Roll No: {rollNo}</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Under Supervision Of</p>
                                            <p className="text-lg font-bold">{supervisor}</p>
                                            <p className="text-xs font-medium text-slate-500">Professor, {department}</p>
                                        </div>
                                    </div>

                                    <div className="pt-12">
                                        <p className="text-xl font-bold tracking-[0.3em]">{date}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col p-20">
                                    <div className="space-y-2 mb-16">
                                        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">{journal || "Publication Name"}</p>
                                        <div className="h-1 bg-yellow-500 w-20" />
                                    </div>

                                    <h1 className="text-4xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
                                        {title || "RESEARCH PAPER TITLE"}
                                    </h1>

                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold">{author}</p>
                                            <p className="text-sm text-slate-500">{affiliation}</p>
                                        </div>
                                    </div>

                                    <div className="mt-20 p-8 border-l-4 border-yellow-500 bg-slate-50 space-y-3">
                                        <p className="text-xs font-black uppercase tracking-widest text-yellow-600">Executive Summary</p>
                                        <p className="text-sm leading-relaxed italic text-slate-600">
                                            This research explores the fundamental shifts in {title.toLowerCase().substring(0, 50)}...
                                            The findings provide a robust framework for further development in the field.
                                        </p>
                                    </div>

                                    <div className="mt-auto flex justify-between items-end border-t pt-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase text-slate-400">Date of Publication</p>
                                            <p className="text-sm font-bold">{date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Official Submission Copy</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
