"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    FileText,
    Plus,
    Search,
    GraduationCap,
    BookOpen,
    FileEdit,
    Clock,
    ChevronRight,
    Loader2,
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const projectTypes = [
    { id: "PHD", label: "PhD Thesis", color: "from-blue-600 to-indigo-600" },
    { id: "RESEARCH_PAPER", label: "Research Paper", color: "from-emerald-600 to-teal-600" },
    { id: "REVIEW", label: "Review Paper", color: "from-amber-600 to-orange-600" },
    { id: "DISSERTATION", label: "Dissertation", color: "from-rose-600 to-pink-600" },
    { id: "SYNOPSIS", label: "Synopsis", color: "from-purple-600 to-violet-600" },
    { id: "INTERNSHIP_REPORT", label: "Internship Report", color: "from-slate-600 to-gray-600" },
    { id: "THESIS", label: "Master Thesis", color: "from-sky-600 to-cyan-600" },
];

export default function ThesisBuilderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showNewDialog, setShowNewDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [fetching, setFetching] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // New Project State
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState("PHD");
    const [newField, setNewField] = useState("");
    const [newDegreeLevel, setNewDegreeLevel] = useState("PhD");

    // Handle ?type=XX&new=1 from sidebar quick-start
    useEffect(() => {
        const typeParam = searchParams.get("type");
        const isNew = searchParams.get("new");
        if (isNew === "1") {
            if (typeParam) setNewType(typeParam);
            setShowNewDialog(true);
            // Clean URL
            router.replace("/thesis-builder");
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("/api/projects");
            setProjects(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newTitle.trim() || !newField.trim()) {
            setErrorMsg("Please fill in both Title and Domain/Field.");
            return;
        }
        setErrorMsg("");
        setLoading(true);
        try {
            const response = await axios.post("/api/projects", {
                title: newTitle.trim(),
                type: newType,
                field: newField.trim(),
                degreeLevel: newDegreeLevel,
            });
            router.push(`/thesis-builder/${response.data.id}`);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error?.response?.data || "Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-x-3">
                        <div className="p-2 bg-pink-100 rounded-xl">
                            <FileText className="w-8 h-8 text-pink-600" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase italic text-slate-900">Research Studio</h1>
                    </div>
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em] ml-1">Advanced Writing &amp; Project Management</p>
                </div>
                <Button
                    onClick={() => { setNewType("PHD"); setShowNewDialog(true); }}
                    className="h-12 px-8 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200"
                >
                    <Plus className="w-5 h-5 mr-3" />
                    New Research
                </Button>
            </div>

            {/* Quick Stats / Info Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none bg-slate-50/50 p-6 rounded-3xl flex items-center gap-x-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <GraduationCap className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase text-slate-400">Total Output</p>
                        <p className="text-xl font-black">{projects.length} Papers</p>
                    </div>
                </Card>
                <Card className="border-none bg-slate-50/50 p-6 rounded-3xl flex items-center gap-x-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <BookOpen className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase text-slate-400">Library Sync</p>
                        <p className="text-xl font-black italic uppercase text-emerald-600">Active</p>
                    </div>
                </Card>
                <Card className="border-none bg-slate-50/50 p-6 rounded-3xl flex items-center gap-x-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Clock className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase text-slate-400">Recent Update</p>
                        <p className="text-xl font-black">
                            {projects.length > 0
                                ? new Date(projects[0].updatedAt).toLocaleDateString()
                                : "—"}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Quick Actions / Categories */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Quick Start Studio</h2>
                    <div className="h-px flex-1 bg-slate-100 ml-6" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {projectTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                setNewType(type.id);
                                setShowNewDialog(true);
                            }}
                            className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-900 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative group w-full max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <Input
                        className="h-14 pl-12 pr-6 rounded-2xl border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-slate-900 text-md font-medium placeholder:text-slate-400 text-slate-900"
                        placeholder="Quick search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-x-2 text-[10px] font-black uppercase text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Cloud Sync Active
                </div>
            </div>

            {/* Project Grid */}
            {fetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse h-64 bg-slate-100 rounded-[2.5rem] border-none" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="relative overflow-hidden border-none bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full group-hover:bg-pink-50 transition-colors duration-500" />

                            <CardHeader className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-slate-900 rounded-2xl shadow-lg ring-4 ring-slate-100 group-hover:scale-110 transition-transform duration-500">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-gradient-to-r ${projectTypes.find(t => t.id === project.type)?.color || "from-slate-600 to-gray-600"} text-white shadow-md`}>
                                        {project.type.replace("_", " ")}
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight group-hover:text-pink-600 transition-colors">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                                    Field: {project.field}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8 pt-0 flex-1">
                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        <span>Completion</span>
                                        <span className="text-slate-900">10%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-slate-900 h-2 rounded-full w-[10%] group-hover:bg-pink-600 transition-all duration-700"></div>
                                    </div>
                                    <p className="text-[10px] italic text-slate-400 font-medium">Last modified: {new Date(project.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </CardContent>

                            <CardFooter className="p-8 pt-0">
                                <Button className="w-full h-12 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all group/btn" asChild>
                                    <Link href={`/thesis-builder/${project.id}`}>
                                        Continue Writing
                                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
                            <Plus className="w-12 h-12 text-slate-200" />
                            <h3 className="text-xl font-black text-slate-300 uppercase italic">Empty Research Repository</h3>
                            <p className="text-slate-400 text-sm font-medium">Create your first project using Quick Start Studio above.</p>
                            <Button
                                onClick={() => setShowNewDialog(true)}
                                className="mt-2 bg-slate-900 text-white hover:bg-black rounded-xl px-6 font-black uppercase tracking-widest text-xs"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Start New Project
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Create Project Dialog ── */}
            {showNewDialog && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <Card className="w-full max-w-2xl border-none rounded-[3rem] shadow-2xl bg-white animate-in zoom-in-95 duration-200">
                        <CardHeader className="p-10 pb-6 flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-3xl font-black uppercase tracking-tight italic text-slate-900">Initialize Project</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Configure your academic development workspace</CardDescription>
                            </div>
                            <button
                                onClick={() => { setShowNewDialog(false); setErrorMsg(""); }}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </CardHeader>

                        <CardContent className="p-10 pt-0 space-y-6">
                            {/* Primary Title */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Primary Title *</Label>
                                <input
                                    type="text"
                                    placeholder="e.g. Investigation Into Neural Architecture Search for Medical Imaging"
                                    className="w-full h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 focus:border-slate-900 focus:outline-none px-5 font-semibold text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>

                            {/* Classification + Domain */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Classification *</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 focus:border-slate-900 focus:outline-none px-5 font-semibold text-sm text-slate-900 appearance-none cursor-pointer transition-colors"
                                            value={newType}
                                            onChange={(e) => setNewType(e.target.value)}
                                        >
                                            {projectTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.label}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Domain / Field *</Label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Computational Physics"
                                        className="w-full h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 focus:border-slate-900 focus:outline-none px-5 font-semibold text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                                        value={newField}
                                        onChange={(e) => setNewField(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Degree Level */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Degree Level</Label>
                                <div className="flex flex-wrap gap-3">
                                    {["UG", "PG", "PhD", "Post-Doc"].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setNewDegreeLevel(level)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${newDegreeLevel === level
                                                ? "bg-slate-900 border-slate-900 text-white shadow-md"
                                                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AI Feature info */}
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-5 rounded-2xl border border-pink-100 space-y-1">
                                <div className="flex items-center gap-x-2">
                                    <GraduationCap className="w-4 h-4 text-pink-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">AI Structure Generation Enabled</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    ResearchPro will auto-generate standard sections (Abstract, Introduction, Literature Review, etc.) for your <strong>{projectTypes.find(t => t.id === newType)?.label}</strong>.
                                </p>
                            </div>

                            {/* Error message */}
                            {errorMsg && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
                                    ⚠️ {errorMsg}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="p-10 pt-0 flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="ghost"
                                className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest text-sm text-slate-600 hover:bg-slate-100"
                                onClick={() => { setShowNewDialog(false); setErrorMsg(""); }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateProject}
                                disabled={loading || !newTitle.trim() || !newField.trim()}
                                className="h-14 flex-[2] bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-x-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Project...
                                    </span>
                                ) : (
                                    "Bootstrap Project"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
