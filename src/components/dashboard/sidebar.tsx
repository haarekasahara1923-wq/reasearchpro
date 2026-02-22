"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Lightbulb,
    FileText,
    Search,
    ShieldCheck,
    FileEdit,
    Presentation,
    BookOpen,
    Settings,
    CreditCard,
    ChevronDown,
    GraduationCap,
    ClipboardList,
    ScrollText,
    Briefcase,
    BookMarked,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const projectTypes = [
    { id: "PHD", label: "PhD Thesis", icon: GraduationCap, color: "text-blue-400" },
    { id: "RESEARCH_PAPER", label: "Research Paper", icon: ScrollText, color: "text-emerald-400" },
    { id: "REVIEW", label: "Review Paper", icon: BookMarked, color: "text-amber-400" },
    { id: "DISSERTATION", label: "Dissertation", icon: ClipboardList, color: "text-rose-400" },
    { id: "SYNOPSIS", label: "Synopsis", icon: FileText, color: "text-purple-400" },
    { id: "INTERNSHIP_REPORT", label: "Internship Report", icon: Briefcase, color: "text-slate-400" },
    { id: "THESIS", label: "Master Thesis", icon: BookOpen, color: "text-sky-400" },
];

const routes = [
    {
        label: "Literature Explorer",
        icon: Search,
        href: "/literature-explorer",
        color: "text-orange-700",
    },
    {
        label: "Plagiarism Checker",
        icon: ShieldCheck,
        href: "/plagiarism-checker",
        color: "text-emerald-500",
    },
    {
        label: "Citation Manager",
        icon: BookOpen,
        href: "/citation-manager",
        color: "text-blue-500",
    },
    {
        label: "Cover Designer",
        icon: FileEdit,
        href: "/cover-designer",
        color: "text-yellow-600",
    },
    {
        label: "PPT Generator",
        icon: Presentation,
        href: "/ppt-generator",
        color: "text-red-500",
    },
    {
        label: "Subscription",
        icon: CreditCard,
        href: "/subscription",
        color: "text-gray-400",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isThesisActive = pathname.startsWith("/thesis-builder");
    const [thesisOpen, setThesisOpen] = useState(isThesisActive);

    const handleQuickStart = (typeId: string) => {
        // Navigate to thesis-builder with preselected type via query param
        router.push(`/thesis-builder?type=${typeId}&new=1`);
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white overflow-y-auto">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-10">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="bg-primary w-full h-full rounded-lg flex items-center justify-center font-bold text-xl">R</div>
                    </div>
                    <h1 className="text-2xl font-bold">ResearchPro</h1>
                </Link>

                <div className="space-y-1">
                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                            pathname === "/dashboard" ? "text-white bg-white/10" : "text-zinc-400",
                        )}
                    >
                        <div className="flex items-center flex-1">
                            <LayoutDashboard className="h-5 w-5 mr-3 text-sky-500" />
                            Dashboard
                        </div>
                    </Link>

                    {/* Topic Generator */}
                    <Link
                        href="/topic-generator"
                        className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                            pathname.startsWith("/topic-generator") ? "text-white bg-white/10" : "text-zinc-400",
                        )}
                    >
                        <div className="flex items-center flex-1">
                            <Lightbulb className="h-5 w-5 mr-3 text-violet-500" />
                            Topic Generator
                        </div>
                    </Link>

                    {/* Thesis Builder — Collapsible */}
                    <div>
                        <button
                            onClick={() => setThesisOpen(!thesisOpen)}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                isThesisActive ? "text-white bg-white/10" : "text-zinc-400",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <FileText className="h-5 w-5 mr-3 text-pink-500" />
                                Thesis Builder
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    thesisOpen ? "rotate-180" : ""
                                )}
                            />
                        </button>

                        {/* Submenu */}
                        <div className={cn(
                            "overflow-hidden transition-all duration-300",
                            thesisOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}>
                            {/* Go to Thesis Builder main page */}
                            <Link
                                href="/thesis-builder"
                                className={cn(
                                    "flex items-center gap-x-2 pl-11 pr-3 py-2 text-xs rounded-lg transition cursor-pointer hover:bg-white/10",
                                    pathname === "/thesis-builder" ? "text-pink-400 font-bold" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                All Projects
                            </Link>

                            {/* Divider */}
                            <div className="mx-4 my-1.5 border-t border-white/5" />

                            <p className="pl-11 text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Quick Start</p>

                            {projectTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleQuickStart(type.id)}
                                    className="w-full flex items-center gap-x-2 pl-11 pr-3 py-2 text-xs rounded-lg transition cursor-pointer hover:bg-white/10 text-zinc-500 hover:text-white"
                                >
                                    <type.icon className={cn("h-3.5 w-3.5 shrink-0", type.color)} />
                                    {type.label}
                                </button>
                            ))}

                            {/* New Project shortcut */}
                            <button
                                onClick={() => router.push("/thesis-builder?new=1")}
                                className="w-full flex items-center gap-x-2 pl-11 pr-3 py-2 mt-1 text-xs rounded-lg transition cursor-pointer bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 font-semibold"
                            >
                                <Plus className="h-3.5 w-3.5 shrink-0" />
                                New Research
                            </button>
                        </div>
                    </div>

                    {/* Rest of routes */}
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
