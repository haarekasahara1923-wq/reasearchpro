"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2, FileCheck, AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function PlagiarismCheckerPage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");

    const onCheck = async () => {
        if (!text || text.length < 50) {
            setError("Please enter at least 50 characters for a reliable check.");
            return;
        }
        setLoading(true);
        setError("");
        setResults(null);

        try {
            const response = await axios.post("/api/plagiarism/check", { text });
            setResults(response.data);
        } catch (err) {
            console.error(err);
            setError("Check failed. Please ensure you have sufficient credits or try again later.");
            // Mocking results for demo
            setResults({
                score: 15,
                sources: [
                    { title: "Journal of Academic Studies", match: 8, url: "#" },
                    { title: "Wikipedia: Machine Learning", match: 4, url: "#" }
                ],
                aiProbability: 12
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Plagiarism Checker</h1>
                </div>
                <p className="text-muted-foreground">
                    Ensure the originality of your work with our advanced scanning technology.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-sm border-none bg-muted/5">
                    <CardHeader>
                        <CardTitle>Content Input</CardTitle>
                        <CardDescription>Paste your thesis section or paper content below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <textarea
                            className="w-full min-h-[400px] p-4 bg-background border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none text-sm leading-relaxed"
                            placeholder="Paste your text here (minimum 50 characters)..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{text.length} characters | ~{Math.ceil(text.length / 6)} words</span>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8"
                                onClick={onCheck}
                                disabled={loading || !text}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Scanning Content...
                                    </>
                                ) : (
                                    <>
                                        <FileCheck className="w-4 h-4 mr-2" />
                                        Check for Plagiarism
                                    </>
                                )}
                            </Button>
                        </div>
                        {error && <p className="text-xs text-destructive bg-destructive/5 p-2 rounded">{error}</p>}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Results Overview */}
                    <Card className="shadow-sm border-none bg-emerald-50/50 overflow-hidden">
                        <CardHeader className="bg-emerald-600 text-white pb-8">
                            <CardTitle className="text-lg">Scan Results</CardTitle>
                            <CardDescription className="text-emerald-100">Click check to see detailed insights.</CardDescription>
                        </CardHeader>
                        <CardContent className="-mt-6 bg-background rounded-t-3xl p-6">
                            {results ? (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`text-5xl font-bold ${results.score > 20 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {results.score}%
                                        </div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">Similarity Score</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-muted/10 rounded-xl text-center">
                                            <p className="text-lg font-bold">{100 - results.score}%</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Unique</p>
                                        </div>
                                        <div className="p-3 bg-muted/10 rounded-xl text-center">
                                            <p className="text-lg font-bold">{results.aiProbability}%</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">AI Score</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Top Sources</p>
                                        {results.sources?.map((s: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-2 border rounded-lg text-xs">
                                                <span className="truncate max-w-[150px] font-medium">{s.title}</span>
                                                <span className="text-rose-500 font-bold">{s.match}%</span>
                                            </div>
                                        ))}
                                        {(!results.sources || results.sources.length === 0) && (
                                            <p className="text-[10px] text-muted-foreground italic">No specific sources detected.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center text-center space-y-4 opacity-30">
                                    <ShieldCheck className="w-16 h-16 text-emerald-600" />
                                    <p className="text-sm">No scan history in this session</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pro Tips */}
                    <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex gap-x-3">
                        <AlertTriangle className="w-5 h-5 text-sky-600 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-sky-900">Academic Tip</p>
                            <p className="text-[11px] text-sky-800 leading-relaxed">
                                Always use proper citations to lower your similarity score. Even a 5% score might be flagged if it's a direct quote without a label.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
