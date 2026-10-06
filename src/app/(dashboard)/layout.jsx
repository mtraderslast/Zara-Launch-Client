"use client";
import { useState } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";

export const dynamic = "force-dynamic";

function Dashboard({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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