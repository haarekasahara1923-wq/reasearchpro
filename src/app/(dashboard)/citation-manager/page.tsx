"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { BookOpen, Copy, Loader2, Search, HelpCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { formatCitation } from "@/lib/citations";

export default function CitationManagerPage() {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<"doi" | "keyword">("doi");
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedResult, setSelectedResult] = useState<any>(null);
    const [style, setStyle] = useState("APA");
    const [copied, setCopied] = useState(false);

    const onSearch = async () => {
        if (!query) return;
        try {
            setLoading(true);
            setSelectedResult(null);
            setSearchResults([]);

            if (mode === "doi") {
                const res = await axios.get(`/api/citations/lookup?doi=${encodeURIComponent(query)}`);
                setSelectedResult(res.data);
            } else {
                const res = await axios.get(`/api/citations/search?q=${encodeURIComponent(query)}`);
                setSearchResults(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Citation Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Create perfect APA, MLA, or Chicago citations by DOI or keywords.
                </p>
            </div>

            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Source Search</CardTitle>
                            <CardDescription>Select your search method to find the research paper.</CardDescription>
                        </div>
                        <div className="flex bg-background p-1 rounded-lg border shadow-sm">
                            <button
                                onClick={() => { setMode("doi"); setQuery(""); setSearchResults([]); setSelectedResult(null); }}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mode === "doi" ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                DOI Lookup
                            </button>
                            <button
                                onClick={() => { setMode("keyword"); setQuery(""); setSearchResults([]); setSelectedResult(null); }}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mode === "keyword" ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                Search Keywords
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-x-3">
                        <div className="flex-1 relative">
                            <Input
                                placeholder={mode === "doi" ? "Paste DOI (e.g. 10.1038/s41586...)" : "Enter Title, Authors or Keywords"}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-12 pl-4 rounded-xl border-muted-foreground/20"
                            />
                            {mode === "doi" && (
                                <div className="absolute right-3 top-3.5 group cursor-help">
                                    <HelpCircle className="w-5 h-5 text-muted-foreground/50 hover:text-blue-500 transition-colors" />
                                    <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        <p className="font-bold mb-1">What is DOI?</p>
                                        A Digital Object Identifier (DOI) is a unique string assigned to research papers. You can find it on the first page of the paper or in its URL.
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={onSearch}
                            disabled={loading || !query}
                            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                            Search
                        </Button>
                    </div>

                    {mode === "keyword" && searchResults.length > 0 && !selectedResult && (
                        <div className="grid gap-3 animate-in fade-in slide-in-from-top-4 mt-6">
                            <p className="text-xs font-bold uppercase text-muted-foreground px-1 tracking-widest">Select relevant source</p>
                            {searchResults.map((res: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedResult(res)}
                                    className="p-4 bg-background border rounded-xl hover:border-blue-500 cursor-pointer transition-all group"
                                >
                                    <h3 className="font-bold text-sm group-hover:text-blue-600 transition-colors">{res.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{res.authors} • {res.year}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedResult && (
                <Card className="animate-in fade-in zoom-in-95 border-blue-500/20 shadow-xl shadow-blue-500/5 bg-background">
                    <CardHeader className="border-b bg-blue-50/30">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{selectedResult.title}</CardTitle>
                                <CardDescription>{selectedResult.authors}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedResult(null)}
                                className="text-muted-foreground hover:text-blue-600"
                            >
                                Change Source
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Publication Year</p>
                                <p className="text-sm font-bold bg-muted/50 w-fit px-3 py-1 rounded-full">{selectedResult.year}</p>
                            </div>
                            <div className="col-span-1 md:col-span-3 space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Journal / Publisher</p>
                                <p className="text-sm font-bold">{selectedResult.journal}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Formatted Citation</p>
                                    <p className="text-[10px] text-muted-foreground">Generated following {style} guidelines</p>
                                </div>
                                <select
                                    className="text-xs font-bold border-2 border-muted-foreground/10 h-10 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer bg-background"
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                >
                                    <option value="APA">APA Style</option>
                                    <option value="MLA">MLA Style</option>
                                    <option value="CHICAGO">Chicago Style</option>
                                </select>
                            </div>

                            <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-blue-100 hover:border-blue-500 transition-all p-1">
                                <div className="p-6 bg-blue-50/50 rounded-xl">
                                    <p className="text-sm leading-relaxed font-serif italic text-slate-800">
                                        {formatCitation(selectedResult, style)}
                                    </p>
                                </div>
                                <Button
                                    className={`absolute top-4 right-4 h-10 px-4 transition-all shadow-lg ${copied ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"}`}
                                    onClick={() => copyToClipboard(formatCitation(selectedResult, style))}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Citation
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {!selectedResult && !loading && searchResults.length === 0 && (
                <div className="py-20 text-center space-y-4 opacity-50 grayscale">
                    <BookOpen className="w-16 h-16 mx-auto text-blue-600" />
                    <div className="max-w-xs mx-auto">
                        <p className="text-sm font-bold">No source selected</p>
                        <p className="text-xs">Search for a paper above to generate its citation instantly.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
