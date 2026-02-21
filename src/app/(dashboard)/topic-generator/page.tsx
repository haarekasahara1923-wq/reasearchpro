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

    const onGenerate = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/topics/generate", {
                field,
                degreeLevel: level,
            });
            setTopics(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-x-2">
                <Lightbulb className="w-8 h-8 text-violet-500" />
                <h1 className="text-3xl font-bold">Topic Generator</h1>
            </div>
            <p className="text-muted-foreground">
                Generate high-quality, unique research topics using our advanced AI.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Research Details</CardTitle>
                    <CardDescription>
                        Specify your field and degree level to get tailored suggestions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Research Field</Label>
                            <Input
                                placeholder="e.g. Artificial Intelligence, Marketing, Clinical Psychology"
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Degree Level</Label>
                            <select
                                className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Masters">Masters</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>
                    </div>
                    <Button
                        className="w-full"
                        onClick={onGenerate}
                        disabled={loading || !field}
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Generate Ideas"}
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">{topic.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2">
                            <p className="text-sm">{topic.description}</p>
                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-dashed border-violet-500">
                                <p className="text-xs font-semibold text-violet-500 uppercase">Research Gap</p>
                                <p className="text-xs italic">{topic.gap}</p>
                            </div>
                        </CardContent>
                        <div className="p-4 pt-0">
                            <Button variant="outline" size="sm" className="w-full">
                                <Save className="w-4 h-4 mr-2" />
                                Save to Projects
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
