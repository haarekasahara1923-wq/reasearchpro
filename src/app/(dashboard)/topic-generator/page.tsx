"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Lightbulb, Loader2, Save } from "lucide-react";
import { useState } from "react";

interface Topic {
    title: string;
    description: string;
    gap: string;
}

export default function TopicGeneratorPage() {
    const [field, setField] = useState("");
    const [level, setLevel] = useState("Masters");
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [error, setError] = useState("");

    const onGenerate = async () => {
        try {
            setLoading(true);
            setError("");
            setTopics([]);
            const response = await axios.post("/api/topics/generate", {
                field,
                degreeLevel: level,
            });

            if (response.data && Array.isArray(response.data)) {
                setTopics(response.data);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || err.message || "Failed to generate ideas. Please check your AI API keys.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <Lightbulb className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
                    <h1 className="text-3xl font-bold tracking-tight">Topic Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Discover high-impact, trending research topics tailored to your specific academic level.
                </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle>Research Parameters</CardTitle>
                    <CardDescription>
                        Specify your research field and current academic standing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="field">Research Field / Subject</Label>
                            <Input
                                id="field"
                                placeholder="e.g. Sustainable Energy, Blockchain in Healthcare, etc."
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Academic Level</Label>
                            <select
                                id="level"
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Masters">Masters</option>
                                <option value="PhD">PhD</option>
                                <option value="Research Scholar">Research Scholar</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <Button
                        className="w-full h-11 text-lg font-semibold"
                        onClick={onGenerate}
                        disabled={loading || !field}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing Trends & Generating Ideas...
                            </>
                        ) : (
                            "Generate 10 Trending Ideas"
                        )}
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                    <Card key={index} className="flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <div className="absolute top-0 left-0 w-12 h-12 bg-primary/10 flex items-center justify-center rounded-br-2xl font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            #{index + 1}
                        </div>
                        <CardHeader className="pt-14">
                            <CardTitle className="text-xl leading-tight min-h-[3rem]">{topic.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-4">{topic.description}</p>
                            <div className="bg-violet-500/5 dark:bg-violet-500/10 p-4 rounded-xl border border-dashed border-violet-500/30">
                                <div className="flex items-center gap-x-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">The Research Gap</p>
                                </div>
                                <p className="text-xs italic text-violet-700 dark:text-violet-300 leading-relaxed">
                                    "{topic.gap}"
                                </p>
                            </div>
                        </CardContent>
                        <div className="p-4 pt-0">
                            <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-white group/btn">
                                <Save className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                Start This Project
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {topics.length === 0 && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed rounded-3xl opacity-50">
                    <Lightbulb className="w-12 h-12 text-muted-foreground" />
                    <div className="space-y-1">
                        <p className="text-lg font-medium text-muted-foreground">No ideas yet</p>
                        <p className="text-sm text-muted-foreground">Enter a subject above to get started</p>
                    </div>
                </div>
            )}
        </div>
    );
}
