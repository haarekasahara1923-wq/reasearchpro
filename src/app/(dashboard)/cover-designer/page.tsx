"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Loader2, Sparkles, Image, Palette, Type, Download } from "lucide-react";
import { useState } from "react";

export default function CoverDesignerPage() {
    const [generating, setGenerating] = useState(false);

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <FileEdit className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Thesis Cover Designer</h1>
                </div>
                <p className="text-muted-foreground">
                    Create a stunning, official-looking cover page for your dissertation or research paper.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customization Panel */}
                <Card className="lg:col-span-1 shadow-sm border-none bg-muted/5">
                    <CardHeader>
                        <CardTitle>Design Elements</CardTitle>
                        <CardDescription>Customize the look and feel of your cover.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Traditional Templates</label>
                            <div className="grid grid-cols-2 gap-2">
                                {["Oxford Style", "Modern Minimal", "Stanford Blue", "Classic Mono"].map(t => (
                                    <Button key={t} variant="outline" className="h-10 text-xs truncate">{t}</Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Typography</label>
                            <div className="flex gap-x-2">
                                <Button variant="ghost" size="icon" className="border"><Type className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="border"><Palette className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="border"><Image className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-yellow-600 hover:bg-yellow-700 h-11"
                            onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2000); }}
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Generate Cover Preview
                        </Button>
                    </CardContent>
                </Card>

                {/* Preview Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="aspect-[1/1.414] w-full max-w-[500px] mx-auto shadow-2xl border-none relative overflow-hidden group">
                        {/* Mock Cover Design */}
                        <div className="absolute inset-0 bg-white p-12 flex flex-col items-center justify-between text-center border-8 border-double border-slate-100">
                            <div className="w-24 h-24 bg-slate-200 rounded-full mb-8 animate-pulse" />
                            <div className="space-y-4">
                                <div className="h-4 w-40 bg-slate-100 mx-auto rounded" />
                                <div className="h-10 w-80 bg-slate-200 mx-auto rounded" />
                                <div className="h-4 w-60 bg-slate-100 mx-auto rounded" />
                            </div>
                            <div className="space-y-2 w-full pt-20">
                                <div className="h-3 w-32 bg-slate-100 mx-auto rounded" />
                                <div className="h-3 w-44 bg-slate-100 mx-auto rounded" />
                                <div className="h-3 w-28 bg-slate-100 mx-auto rounded" />
                            </div>
                            <div className="mt-auto pt-10 border-t w-full">
                                <div className="h-4 w-48 bg-slate-200 mx-auto rounded" />
                            </div>
                        </div>

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-x-4">
                            <Button className="bg-white text-black hover:bg-slate-100 font-bold">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    </Card>
                    <p className="text-center text-xs text-muted-foreground">Preview reflects a standard academic template.</p>
                </div>
            </div>
        </div>
    );
}
