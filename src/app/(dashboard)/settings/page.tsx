"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield, CreditCard, Save, Loader2, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setImage(session.user.image || "");
        }
    }, [session]);

    const onSave = async () => {
        try {
            setIsSaving(true);
            await axios.patch("/api/user/profile", { name, image });
            await update({ name, image });
            // Show success toast here if available
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-x-3">
                <div className="p-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
                    <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Settings</h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Personalize your research workspace</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-1">
                    {[
                        { label: "Profile", icon: User, active: true },
                        { label: "Preferences", icon: Bell },
                        { label: "Security", icon: Shield },
                        { label: "Plan", icon: CreditCard },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`flex items-center gap-x-3 w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${item.active ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-500'}`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="shadow-2xl border-none bg-white rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b p-8">
                            <CardTitle className="text-xl font-black uppercase">Identity & Profile</CardTitle>
                            <CardDescription className="font-medium">Managing your public presence in ResearchPro</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-8">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                                        <AvatarImage src={image} />
                                        <AvatarFallback className="bg-slate-900 text-white text-4xl font-black">
                                            {name?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Display Name</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your Name"
                                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Image (URL)</Label>
                                        <Input
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder="https://..."
                                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</Label>
                                <Input value={session?.user?.email || ""} disabled className="h-12 rounded-xl bg-slate-50 border-slate-100 text-slate-400 font-medium" />
                                <p className="text-[10px] text-slate-400 font-bold italic">Primary email cannot be changed for security.</p>
                            </div>

                            <div className="pt-6 border-t flex justify-end">
                                <Button
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="h-12 px-10 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Update Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl shadow-red-500/5 border-2 border-dashed border-red-100 bg-red-50/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-red-900 font-black uppercase text-sm flex items-center gap-x-2">
                                <Shield className="w-4 h-4" /> Account Privacy
                            </CardTitle>
                            <CardDescription className="text-red-700 font-medium">Your data is secured with enterprise-grade encryption.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}
