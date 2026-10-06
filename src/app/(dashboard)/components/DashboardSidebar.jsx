"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ChevronRight, X, UserPen, ShoppingBag, PlusCircle, PackageCheck, FolderPlus, Layers } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { TiShoppingCart } from "react-icons/ti";
import { FaHeart } from "react-icons/fa";

const MENU_CONFIG = {
    admin: [
        { name: "ডেশবোর্ড", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "সিঙ্গেল অর্ডার", href: "/dashboard/admin/single-orders", icon: ShoppingBag },
        { name: "এড প্রোডাক্ট", href: "/dashboard/admin/add-product", icon: PlusCircle },
        { name: "মেনেজ প্রোডাক্ট", href: "/dashboard/admin/manage-products", icon: PackageCheck },
        { name: "কম্বো অর্ডার", href: "/dashboard/admin/combo-orders", icon: ShoppingBag },
        { name: "এড কম্বো", href: "/dashboard/admin/add-combo", icon: FolderPlus },
        { name: "মেনেজ কম্বো", href: "/dashboard/admin/manage-combos", icon: Layers },
    ],

    user: [
        { name: "ডেশবোর্ড", href: "/dashboard/user", icon: LayoutDashboard },
        { name: "মাই অর্ডার", href: "/dashboard/user/my-orders", icon: TiShoppingCart },
        { name: "ফেভারিট", href: "/dashboard/user/my-favorites", icon: FaHeart },
        { name: "প্রোফাইল", href: "/my-profile", icon: UserPen },
    ],
};

function DashboardSidebar({ isOpen, closeSidebar }) {
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;
    const role = user?.role;

    if (isPending) {
        return (
            <aside className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col justify-between border-r border-amber-200/60 bg-white/85 text-slate-900 backdrop-blur-xl transition-all duration-300 lg:static shrink-0 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#c59b27] border-t-transparent m-auto" />
            </aside>
        );
    }

    if (!user || !role) return null;

    const menuItems = MENU_CONFIG[role] || [];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col justify-between border-r border-amber-200/60 bg-white/85 text-slate-900 backdrop-blur-xl transition-all duration-300 lg:static shrink-0 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
            <div className="flex flex-1 flex-col overflow-y-auto pt-6">
                <div className="mb-8 flex items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex flex-col">
                            <span className="font-serif text-xl sm:text-2xl font-bold text-[#2C2724] transition-colors duration-300 group-hover:text-[#9E7B66]">
                                Zara Launch
                            </span>
                            <span className="text-[9px] tracking-[0.35em] text-[#8C7A6B] uppercase mt-1">
                                Modern Fashion & Beauty
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={() => closeSidebar?.()}
                        className="rounded-lg p-1.5 text-slate-700 transition-all duration-200 hover:bg-amber-100/50 hover:text-[#c59b27] lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6 px-4">
                    <div className="flex items-center gap-3 rounded-xl border border-amber-200/80 bg-amber-50/30 p-3 transition-colors duration-300">
                        <img
                            src={user?.image || "/user.png"}
                            alt={user?.name || "User"}
                            className="h-10 w-10 rounded-full border border-amber-200/80 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-semibold text-slate-900">
                                {user?.name}
                            </h4>

                            <p className="truncate text-xs text-slate-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const isDashboard = item.href === `/dashboard/${role}`;

                        const isActive = isDashboard
                            ? pathname === item.href
                            : pathname === item.href ||
                            pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => closeSidebar?.()}
                                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#a67c13] text-white shadow-md shadow-amber-900/10"
                                    : "text-slate-700 hover:bg-amber-100/40 hover:text-[#c59b27]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        size={18}
                                        className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "" : "opacity-75 group-hover:opacity-100 text-[#c59b27]"
                                            }`}
                                    />

                                    <span>{item.name}</span>
                                </div>

                                {isActive && (
                                    <ChevronRight
                                        size={14}
                                        className="opacity-90"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-amber-200/60 p-4">
                <div className="rounded-lg bg-amber-50/30 border border-amber-200/60 px-3 py-2 transition-colors duration-300">
                    <p className="text-center text-[11px] font-medium capitalize text-amber-900/80">
                        Logged in as {user?.role?.replace("_", " ")}
                    </p>
                </div>
            </div>
        </aside>
    );
}

export default DashboardSidebar;