"use client";

import { UserButton } from "@/components/dashboard/user-button";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

export const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end">
                <UserButton />
            </div>
        </div>
    );
};
