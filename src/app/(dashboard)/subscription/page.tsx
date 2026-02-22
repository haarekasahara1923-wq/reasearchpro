"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        features: [
            "3 Academic Projects",
            "Basic AI Writing (1000 words/mo)",
            "Standard PPT Templates",
            "PDF Exports Only"
        ],
        current: true,
        buttonText: "Current Plan"
    },
    {
        name: "Pro",
        price: "$19",
        features: [
            "Unlimited Projects",
            "Advanced AI Assistant (GPT-4o)",
            "Plagiarism Scanner (50 checks/mo)",
            "DOCX & PDF Exports",
            "Priority Support"
        ],
        current: false,
        buttonText: "Upgrade to Pro",
        popular: true
    },
    {
        name: "Scholar",
        price: "$49",
        features: [
            "Everything in Pro",
            "Unlimited Plagiarism Checks",
            "Human-in-the-loop Review",
            "Journal Submission Guide",
            "Custom PPT Branding"
        ],
        current: false,
        buttonText: "Get Scholar"
    }
];

export default function SubscriptionPage() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4 py-10">
                <div className="inline-flex items-center gap-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold animate-pulse">
                    <Zap className="w-4 h-4" />
                    Early Bird Offer: 20% Off Pro Plans
                </div>
                <h1 className="text-5xl font-black tracking-tight">Choose Your Research Speed</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Power your academic career with enterprise-grade AI and research tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <Card key={i} className={`relative flex flex-col shadow-xl border-none ${plan.popular ? 'scale-105 ring-2 ring-primary' : ''}`}>
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}
                        <CardHeader className="text-center pt-10">
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <div className="flex items-baseline justify-center gap-x-1 pt-4">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4 pt-10">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-x-3">
                                    <div className="bg-emerald-500/10 p-1 rounded-full">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium">{feature}</span>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="pb-10 pt-6">
                            <Button
                                className={`w-full h-12 text-lg font-bold ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : ''}`}
                                variant={plan.current ? "outline" : "default"}
                            >
                                {plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="bg-muted/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border">
                <div className="flex items-center gap-x-4">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border">
                        <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-xl">Secure Payments</h4>
                        <p className="text-sm text-muted-foreground">Encryption powered by Stripe & Razorpay</p>
                    </div>
                </div>
                <div className="flex items-center gap-x-8">
                    <div className="text-center">
                        <p className="text-2xl font-black">10,000+</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Researchers</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="text-center">
                        <p className="text-2xl font-black">2.5M</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Pages Scanned</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
