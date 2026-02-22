"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, Loader2, Sparkles, Layout, Monitor, Download, Trash2 } from "lucide-react";
import { useState } from "react";

export default function PptGeneratorPage() {
    const [topic, setTopic] = useState("");
    const [generating, setGenerating] = useState(false);

    const onGenerate = () => {
        setGenerating(true);
        setTimeout(() => setGenerating(false), 3000);
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Presentation className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">AI PPT Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Convert your research or thesis into a professional presentation in seconds.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-sm border-none bg-muted/5">
                    <CardHeader>
                        <CardTitle>Presentation Topic</CardTitle>
                        <CardDescription>Enter the topic or select an existing project to generate slides.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <textarea
                            className="w-full h-32 p-4 bg-background border rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                            placeholder="e.g. Recent Trends in Cybersecurity in 2024..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-xl flex items-center gap-x-3 hover:bg-white cursor-pointer transition">
                                <Monitor className="w-5 h-5 text-muted-foreground" />
                                <div className="text-left">
                                    <p className="text-xs font-bold">Standard 16:9</p>
                                    <p className="text-[10px] text-muted-foreground">Best for monitors</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-xl flex items-center gap-x-3 hover:bg-white cursor-pointer transition">
                                <Layout className="w-5 h-5 text-muted-foreground" />
                                <div className="text-left">
                                    <p className="text-xs font-bold">Slide Designs</p>
                                    <p className="text-[10px] text-muted-foreground">Modern Academic</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full h-11 bg-red-600 hover:bg-red-700 font-semibold"
                            onClick={onGenerate}
                            disabled={generating || !topic}
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Designing Slides...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Presentation
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold">Recent Presentations</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm hover:border-red-500/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-x-4">
                                    <div className="p-3 bg-red-50 rounded-xl">
                                        <Presentation className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold truncate max-w-[200px]">Research Methodology Overview</p>
                                        <p className="text-[10px] text-muted-foreground">Created 2 days ago • 12 Slides</p>
                                    </div>
                                </div>
                                <div className="flex gap-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 text-white">
                        <h3 className="text-xl font-bold mb-2">Pro Slides Premium</h3>
                        <p className="text-sm text-red-100 mb-6">Get access to custom branding, animated transitions, and image generation for your slides.</p>
                        <Button variant="secondary" className="bg-white text-red-600 hover:bg-red-50 font-bold">
                            Upgrade Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
