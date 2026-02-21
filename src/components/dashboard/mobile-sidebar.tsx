"use client";

import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                <Menu />
            </Button>
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50">
                    <div className="w-72 h-full bg-[#111827]">
                        <div className="flex justify-end p-4">
                            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white">X</Button>
                        </div>
                        <Sidebar />
                    </div>
                </div>
            )}
        </div>
    );
};
