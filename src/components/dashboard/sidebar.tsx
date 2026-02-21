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
    CreditCard
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Topic Generator",
        icon: Lightbulb,
        href: "/topic-generator",
        color: "text-violet-500",
    },
    {
        label: "Thesis Builder",
        icon: FileText,
        href: "/thesis-builder",
        color: "text-pink-700",
    },
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

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="bg-primary w-full h-full rounded-lg flex items-center justify-center font-bold text-xl">R</div>
                    </div>
                    <h1 className="text-2xl font-bold">
                        ResearchPro
                    </h1>
                </Link>
                <div className="space-y-1">
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
