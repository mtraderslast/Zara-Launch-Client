"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Sparkles,
    PackageOpen,
    Loader2,
    ShieldCheck,
    Truck,
    RefreshCw,
    Headphones,
    ArrowLeft,
} from "lucide-react";
import ComboCard from "@/components/ComboCard";
import { fetchActiveCombos } from "@/lib/action/combos";

export default function CombosPage() {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCombos = async () => {
            try {
                setLoading(true);
                const response = await fetchActiveCombos();
                setCombos(response?.data || []);
            } catch (error) {
                console.error("Failed to fetch combos:", error);
                setCombos([]);
            } finally {
                setLoading(false);
            }
        };

        getCombos();
    }, []);

    return (
        <div className="w-full bg-[#FAF8F5] text-[#2C2724]">
            
            {/* মেইন কন্টেন্ট সেকশন */}
            <main className="mx-auto pb-4 px-4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-28 text-[#9E7B66] space-y-3">
                        <Loader2 className="w-9 h-9 animate-spin" />
                        <p className="text-xs text-[#70645C] tracking-wide">কম্বো প্যাকেজ লোড হচ্ছে...</p>
                    </div>
                ) : combos.length === 0 ? (
                    /* কম্বো না থাকলে ডিফল্ট সুন্দর এম্পটি স্টেট */
                    <div className="my-8 max-w-lg mx-auto bg-[#FFFFFF] border border-[#E8E1D9] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E1D9] flex items-center justify-center mx-auto text-[#9E7B66]">
                            <PackageOpen className="w-8 h-8 stroke-[1.5]" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2724]">
                                বর্তমানে কোনো কম্বো অফার চালু নেই
                            </h3>
                            <p className="text-xs sm:text-sm text-[#70645C] leading-relaxed">
                                আমরা শীঘ্রই নতুন ও আকর্ষণীয় কম্বো প্যাকেজ নিয়ে আসছি। অনুগ্রহ করে আমাদের নিয়মিত পণ্যের কালেকশনগুলো দেখুন।
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] transition-all shadow-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>সকল পণ্য দেখুন</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* কম্বো প্যাকেজ গ্রিড */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
                        {combos.map((combo) => (
                            <ComboCard key={combo._id} combo={combo} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}