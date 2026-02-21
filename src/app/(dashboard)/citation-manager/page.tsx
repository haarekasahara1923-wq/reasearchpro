"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { BookOpen, Copy, Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function CitationManagerPage() {
    const [doi, setDoi] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [style, setStyle] = useState("APA");

    const onLookup = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/citations/lookup?doi=${encodeURIComponent(doi)}`);
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Add toast notification later
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center gap-x-2">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold">Citation Manager</h1>
            </div>
            <p className="text-muted-foreground">
                Search for DOI and generate perfect APA, MLA, or Chicago citations instantly.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>DOI Lookup</CardTitle>
                    <CardDescription>Enter a Digital Object Identifier (DOI) to fetch metadata.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-x-2">
                        <div className="flex-1">
                            <Input
                                placeholder="e.g. 10.1038/s41586-020-2012-7"
                                value={doi}
                                onChange={(e) => setDoi(e.target.value)}
                            />
                        </div>
                        <Button onClick={onLookup} disabled={loading || !doi}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <Card className="animate-fade-in border-blue-500/30">
                    <CardHeader>
                        <CardTitle>{result.title}</CardTitle>
                        <CardDescription>{result.authors}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <Label className="text-xs uppercase text-muted-foreground">Year</Label>
                                <p className="font-semibold">{result.year}</p>
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <Label className="text-xs uppercase text-muted-foreground">Journal / Publisher</Label>
                                <p className="font-semibold">{result.journal}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Formatted Citation</Label>
                                <div className="flex gap-x-2">
                                    <select
                                        className="text-xs border rounded p-1"
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                    >
                                        <option value="APA">APA</option>
                                        <option value="MLA">MLA</option>
                                        <option value="CHICAGO">Chicago</option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative p-4 bg-muted rounded-lg group">
                                <p className="text-sm italic">
                                    {/* This is a simplified display, logic would handle style changes */}
                                    {result.authors} ({result.year}). {result.title}. {result.journal}. {result.doi}
                                </p>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                                    onClick={() => copyToClipboard(`${result.authors} (${result.year}). ${result.title}. ${result.journal}. ${result.doi}`)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
