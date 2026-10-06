"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, User as UserIcon, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function DashboardHeader({ onMenuClick }) {
    const { data: session, isPending } = authClient.useSession();
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

    const user = session?.user;

    if (isPending) {
        return <div className="p-4 text-amber-900/80">Loading...</div>;
    }

    return (
        <header className="shrink-0 flex h-16 items-center justify-between border-b border-amber-200/60 bg-white/85 px-4 backdrop-blur-xl shadow-sm transition-colors duration-300 lg:px-6">

            {/* Search & Mobile Menu Button */}
            <div className="flex max-w-xl flex-1 items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-700 transition-all duration-200 hover:bg-amber-100/50 hover:text-[#c59b27] lg:hidden"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Right Side */}
            <div className="ml-1 flex items-center gap-3 md:gap-4">

                <div className="h-8 w-px bg-amber-200/60"></div>

                <div className="relative flex items-center gap-3">

                    {/* User Info */}
                    <div className="hidden text-right lg:block">
                        <h5 className="text-sm font-semibold text-slate-900">
                            {user?.name}
                        </h5>

                        <p className="text-xs capitalize text-amber-900/80 font-medium">
                            {user?.role}
                        </p>
                    </div>

                    {/* Avatar Button */}
                    <button
                        onClick={() => setAvatarMenuOpen((prev) => !prev)}
                        className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-amber-200/80 transition-all duration-200 hover:border-[#c59b27] focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30"
                    >
                        <img
                            src={user?.image || "/user.png"}
                            alt={user?.name || "User"}
                            className="h-full w-full object-cover"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {avatarMenuOpen && (
                        <div className="absolute right-0 top-12 z-50 w-56 animate-in slide-in-from-top-2 fade-in rounded-xl border border-amber-200/60 bg-white/95 backdrop-blur-xl shadow-xl shadow-amber-900/5 duration-200">

                            {/* Dropdown User Header */}
                            <div className="flex items-center gap-3 border-b border-amber-200/60 px-4 py-3">
                                <img
                                    src={user?.image || "/user.png"}
                                    alt={user?.name || "User"}
                                    className="h-10 w-10 rounded-full border border-amber-200/80 object-cover"
                                />

                                <div className="overflow-hidden">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {user?.name}
                                    </p>

                                    <p className="truncate text-xs text-slate-500">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Dropdown Actions */}
                            <div className="p-2">

                                <Link
                                    href={`/my-profile`}
                                    onClick={() => setAvatarMenuOpen(false)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-amber-50 hover:text-[#c59b27]"
                                >
                                    <UserIcon size={15} />
                                    প্রোফাইল
                                </Link>

                                <button
                                    onClick={() => {
                                        setAvatarMenuOpen(false);

                                        authClient.signOut({
                                            fetchOptions: {
                                                onSuccess: () => {
                                                    window.location.href = "/";
                                                },
                                            },
                                        });
                                    }}
                                    className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
                                >
                                    <LogOut size={15} />
                                    লগ আউট
                                </button>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;