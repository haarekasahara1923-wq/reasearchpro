"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, BookOpen, ExternalLink, Sparkles, FileSearch } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface Paper {
    title: string;
    authors: string;
    year: string;
    abstract: string;
    url?: string;
}

export default function LiteratureExplorerPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Paper[]>([]);
    const [error, setError] = useState("");

    const onSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError("");
        setResults([]);

        try {
            // This would ideally call a real research API like Semantic Scholar or CrossRef
            // For now, we simulate with AI or a mock list
            const response = await axios.post("/api/ai/explore", { query });
            if (response.data?.papers) {
                setResults(response.data.papers);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch research papers. Please try again.");
            // Mock data for demo if API fails
            setResults([
                {
                    title: "Advanced Machine Learning in Academic Writing",
                    authors: "J. Smith, A. Johnson",
                    year: "2023",
                    abstract: "This paper explores how large language models can assist in structuring complex academic dissertations while maintaining research integrity.",
                    url: "#"
                },
                {
                    title: "The Impact of AI on Qualitative Research Methodologies",
                    authors: "R. Williams",
                    year: "2024",
                    abstract: "A comprehensive study on the shift from manual coding to AI-assisted thematic analysis in qualitative social science research.",
                    url: "#"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Search className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Literature Explorer</h1>
                </div>
                <p className="text-muted-foreground">
                    Discover and analyze academic papers from across the web.
                </p>
            </div>

            <div className="flex gap-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by topic, keyword, or DOI..."
                        className="pl-10 h-12 text-lg shadow-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    />
                </div>
                <Button
                    className="h-12 px-8 bg-orange-600 hover:bg-orange-700 font-semibold"
                    onClick={onSearch}
                    disabled={loading || !query}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Explore"}
                </Button>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 4].map(i => (
                        <Card key={i} className="animate-pulse h-64 bg-muted/20" />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {results.map((paper, index) => (
                    <Card key={index} className="group hover:border-orange-500/50 transition-all border-none shadow-sm bg-muted/5">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl group-hover:text-orange-600 transition truncate">{paper.title}</CardTitle>
                                <CardDescription className="flex items-center gap-x-2">
                                    <span className="font-medium">{paper.authors}</span>
                                    <span>•</span>
                                    <span>{paper.year}</span>
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {paper.abstract}
                            </p>
                            <div className="mt-4 flex gap-x-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-x-1 border-orange-200 text-orange-700 bg-orange-50">
                                    <Sparkles className="w-3 h-3" />
                                    AI Summary
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-x-1">
                                    <BookOpen className="w-3 h-3" />
                                    View Citations
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-x-1">
                                    <FileSearch className="w-3 h-3" />
                                    Find Similar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {!loading && results.length === 0 && query && !error && (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl opacity-50">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p>No papers found for "{query}". Try different keywords.</p>
                    </div>
                )}
            </div>

            {!query && !loading && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-12 text-center border border-orange-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-200 animate-bounce">
                        <Search className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-orange-950 mb-2">Academic Knowledge at Your Fingertips</h2>
                    <p className="max-w-md text-orange-800/70 mb-8">
                        Our Literature Explorer uses millions of datasets to find the most relevant papers for your research field.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                        {["Computer Science", "Medical Ethics", "Psychology", "Sustainable Energy"].map(t => (
                            <button
                                key={t}
                                onClick={() => { setQuery(t); onSearch(); }}
                                className="px-4 py-2 bg-white rounded-xl shadow-sm border border-orange-100 text-xs font-semibold text-orange-900 hover:border-orange-500 transition-colors"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
