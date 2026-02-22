"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Save, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProjectEditorPage({ params }: { params: { projectId: string } }) {
    const [title, setTitle] = useState("Impact of AI on Healthcare"); // Mock title

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="border-b bg-background p-4 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Link href="/thesis-builder">
                        <Button variant="ghost" size="sm">Back</Button>
                    </Link>
                    <div className="h-4 w-px bg-border mx-2" />
                    <h1 className="font-semibold text-lg">{title}</h1>
                </div>
                <div className="flex items-center gap-x-2">
                    <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    <Button size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Sections */}
                <div className="w-64 border-r bg-muted/30 overflow-y-auto p-4 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Structure</p>
                    {["Abstract", "Introduction", "Literature Review", "Methodology", "Results", "Discussion", "Conclusion", "References"].map((section) => (
                        <button key={section} className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-background transition truncate">
                            {section}
                        </button>
                    ))}
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-background">
                    <Card className="max-w-4xl mx-auto min-h-[800px] shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center border-b pb-8 mt-10">
                                {title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-12 prose dark:prose-invert max-w-none">
                            <p className="text-muted-foreground text-center italic mb-10">Start writing your research paper here...</p>

                            <div className="flex justify-center mt-20">
                                <Button variant="outline" className="gap-x-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Generate Section with AI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Assistant Panel */}
                <div className="w-80 border-l bg-muted/10 p-4">
                    <div className="flex items-center gap-x-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">AI Writing Assistant</h2>
                    </div>
                    <div className="bg-background rounded-xl p-4 border shadow-sm space-y-4">
                        <p className="text-xs text-muted-foreground">Ask me to help write sections, improve grammar, or find citations.</p>
                        <textarea
                            className="w-full h-32 bg-muted/30 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary border-none"
                            placeholder="Type instructions here..."
                        />
                        <Button className="w-full size-sm">Generate Content</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
