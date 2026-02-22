"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const projectTypes = [
    { id: "THESIS", label: "Thesis" },
    { id: "PHD", label: "PhD Thesis" },
    { id: "REVIEW", label: "Review Paper" },
    { id: "DISSERTATION", label: "Dissertation" },
    { id: "SYNOPSIS", label: "Synopsis" },
    { id: "INTERNSHIP_REPORT", label: "Internship Report" },
];

export default function ThesisBuilderPage() {
    const router = useRouter();
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
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
        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        if (!newProjectTitle) return;
        setLoading(true);
        try {
            const response = await axios.post("/api/projects", {
                title: newProjectTitle,
                type: "PHD",
                field: "Academic Research"
            });
            router.push(`/thesis-builder/${response.data.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Thesis & Research Builder</h1>
                    <p className="text-muted-foreground">Manage and create your academic research projects.</p>
                </div>
                <Button onClick={() => setShowNewDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                    className="pl-10"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {fetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse h-48 bg-muted/20" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="hover:border-primary transition cursor-pointer group">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                        {project.type}
                                    </span>
                                </div>
                                <CardTitle className="mt-4 line-clamp-1">{project.title}</CardTitle>
                                <CardDescription>
                                    Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full bg-muted rounded-full h-2 mt-2">
                                    <div className="bg-primary h-2 rounded-full w-[10%]"></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Draft Mode Enabled</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full" asChild>
                                    <Link href={`/thesis-builder/${project.id}`}>Continue Writing</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl opacity-50">
                            <p>No projects found. Create one to get started!</p>
                        </div>
                    )}
                </div>
            )}

            {showNewDialog && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Create New Project</CardTitle>
                            <CardDescription>Set up the basic details for your research paper.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    placeholder="e.g. A Comparative Study of..."
                                    value={newProjectTitle}
                                    onChange={(e) => setNewProjectTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Project Type</Label>
                                    <select className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                        {projectTypes.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Field of Study</Label>
                                    <Input placeholder="e.g. Computer Science" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-x-2">
                            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
                            <Button onClick={handleCreateProject} disabled={!newProjectTitle}>
                                {loading ? "Creating..." : "Create Project"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
