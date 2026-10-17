"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";

function FullScreenLoader({ text }) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#FAF8F5] text-[#9E7B66]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-xs text-[#70645C]">{text}</p>
        </div>
    );
}

function Dashboard({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isAdmin = user?.role === "admin";

    // রুট প্রোটেকশন: শুধু অ্যাডমিন ড্যাশবোর্ডে ঢুকতে পারবে
    //  - লগইন করা নেই  => লগইন পেজে (লগইনের পর আবার এই পেজে ফিরে আসবে)
    //  - লগইন আছে কিন্তু অ্যাডমিন নয় => হোম পেজে
    useEffect(() => {
        if (isPending) return;

        if (!user) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard/admin")}`);
        } else if (!isAdmin) {
            router.replace("/");
        }
    }, [isPending, user, isAdmin, pathname, router]);

    if (isPending) {
        return <FullScreenLoader text="যাচাই করা হচ্ছে..." />;
    }

    // রিডাইরেক্ট হওয়ার আগ পর্যন্ত অ্যাডমিন UI একদমই দেখানো হবে না
    if (!user || !isAdmin) {
        return <FullScreenLoader text="রিডাইরেক্ট করা হচ্ছে..." />;
    }

    return (
        <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] text-slate-900">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#f3e5ab]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-3xl" />

            <div
                className={`fixed inset-y-0 left-0 z-50 h-full shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    closeSidebar={() => setIsSidebarOpen(false)}
                />
            </div>

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-amber-950/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            <div className="relative z-10 flex flex-1 flex-col h-full min-w-0 overflow-hidden">
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
