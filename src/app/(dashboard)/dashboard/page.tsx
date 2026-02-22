"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    Lightbulb,
    Search,
    ShieldCheck,
    BookOpen,
    CreditCard,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const tools = [
    {
        title: "Topic Generator",
        description: "Generate unique research topics with AI.",
        href: "/topic-generator",
        icon: Lightbulb,
        color: "text-violet-500",
    },
    {
        title: "Thesis Builder",
        description: "Multi-step guide to write your thesis.",
        href: "/thesis-builder",
        icon: FileText,
        color: "text-pink-700",
    },
    {
        title: "Literature Explorer",
        icon: Search,
        href: "/literature-explorer",
        color: "text-orange-700",
        description: "RAG-powered research search."
    },
    {
        title: "Plagiarism Checker",
        icon: ShieldCheck,
        href: "/plagiarism-checker",
        color: "text-emerald-500",
        description: "Check for academic integrity."
    },
];

export default function DashboardPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("/api/projects");
                setProjects(response.data.slice(0, 5)); // Get last 5 projects
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const stats = [
        {
            label: "Total Projects",
            value: projects.length.toString(),
            icon: FileText,
            color: "text-sky-500",
            bgColor: "bg-sky-500/10",
        },
        {
            label: "AI Words Used",
            value: "45,210",
            icon: Lightbulb,
            color: "text-violet-500",
            bgColor: "bg-violet-500/10",
        },
        {
            label: "Citations Saved",
            value: "124",
            icon: BookOpen,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            label: "Current Plan",
            value: "PhD Premium",
            icon: CreditCard,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="p-4 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold">Welcome back, Scholar!</h1>
                <p className="text-muted-foreground">Here is an overview of your research progress and tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-md`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quick Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href}>
                            <Card className="hover:shadow-md transition cursor-pointer group h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <tool.icon className={`h-8 w-8 ${tool.color}`} />
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {tool.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
                            </div>
                        ) : projects.length > 0 ? (
                            projects.map((project) => (
                                <Link key={project.id} href={`/thesis-builder/${project.id}`}>
                                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition cursor-pointer mb-2">
                                        <div className="flex items-center gap-x-3">
                                            <FileText className="h-5 w-5 text-zinc-500" />
                                            <div>
                                                <p className="font-medium text-sm">{project.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-zinc-100 px-2 py-1 rounded">{project.type}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                                No projects yet. Start by generating a topic!
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Usage Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>AI Words Used</span>
                                <span className="font-semibold">45,210 / 150,000</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-violet-500 h-2 rounded-full w-[30%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Plagiarism Checks</span>
                                <span className="font-semibold">2 / 10</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full w-[20%]"></div>
                            </div>
                        </div>
                        <Button className="w-full" variant="outline">Upgrade Plan</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
