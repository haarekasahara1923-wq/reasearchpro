"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Settings, User, CreditCard, Shield } from "lucide-react";
import Link from "next/link";

export const UserButton = () => {
    const { data: session } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:opacity-80 transition flex items-center gap-x-3 p-1 rounded-full border border-slate-100 pr-4 bg-white/50 backdrop-blur-sm shadow-sm group">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-slate-900 text-white font-black">
                            {session?.user?.name?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Researcher</p>
                        <p className="text-xs font-bold text-slate-700 leading-none">{session?.user?.name || "Member"}</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl border-none mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900">{session?.user?.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                            {session?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-50" />
                <Link href="/settings">
                    <DropdownMenuItem className="p-3 rounded-xl cursor-not-allowed cursor-pointer">
                        <User className="mr-3 h-4 w-4 text-slate-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Edit Profile</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                    <DropdownMenuItem className="p-3 rounded-xl cursor-pointer">
                        <Settings className="mr-3 h-4 w-4 text-slate-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Account Settings</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/subscription">
                    <DropdownMenuItem className="p-3 rounded-xl cursor-pointer">
                        <CreditCard className="mr-3 h-4 w-4 text-slate-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Billing & Plan</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="p-3 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
