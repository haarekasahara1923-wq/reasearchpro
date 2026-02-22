"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield, CreditCard, Mail, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-x-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                    <Settings className="w-8 h-8 text-slate-600" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-1">
                    {[
                        { label: "Profile", icon: User },
                        { label: "Notifications", icon: Bell },
                        { label: "Security", icon: Shield },
                        { label: "Billing", icon: CreditCard },
                    ].map((item, i) => (
                        <button key={i} className={`flex items-center gap-x-3 w-full p-3 rounded-xl text-sm font-medium transition ${i === 0 ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-muted-foreground'}`}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="shadow-sm border-none bg-muted/5">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your profile details and research focus.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="Loading..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input placeholder="Loading..." disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Research Field</Label>
                                <Input placeholder="e.g. Computer Science" />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button className="gap-x-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-none bg-rose-50 border border-rose-100">
                        <CardHeader>
                            <CardTitle className="text-rose-900">Danger Zone</CardTitle>
                            <CardDescription className="text-rose-700">Permanently delete your account and all research data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
