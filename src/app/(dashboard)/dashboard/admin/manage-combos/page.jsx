"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    Layers,
    ExternalLink,
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchAllCombosAdmin, deleteCombo } from "@/lib/action/combos";

export default function ManageCombosPage() {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCombo, setSelectedCombo] = useState(null);

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

    const loadCombos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchAllCombosAdmin({ page, limit: 10 });
            if (response?.success) {
                setCombos(response.data || []);
                if (response.meta) {
                    setMeta(response.meta);
                }
            }
        } catch (error) {
            console.error("Error loading combos:", error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadCombos();
    }, [loadCombos]);

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: `"${title}" কম্বো প্যাকেজটি সম্পূর্ণ মুছে ফেলা হবে!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#A8483B",
            cancelButtonColor: "#70645C",
            confirmButtonText: "হ্যাঁ, মুছুন",
            cancelButtonText: "বাতিল",
            background: "#FAF8F5",
            color: "#2C2724",
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteCombo(id);
                if (response?.success) {
                    Swal.fire({
                        icon: "success",
                        title: "মুছে ফেলা হয়েছে!",
                        text: "কম্বো প্যাকেজটি সফলভাবে মুছে ফেলা হয়েছে।",
                        confirmButtonColor: "#2C2724",
                    });
                    setCombos((prev) => prev.filter((item) => item._id !== id));
                    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "ব্যর্থ হয়েছে",
                        text: response?.message || "কম্বো মুছতে সমস্যা হয়েছে।",
                        confirmButtonColor: "#A8483B",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "ত্রুটি!",
                    text: error?.message || "সার্ভার এরর",
                    confirmButtonColor: "#A8483B",
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#2C2724] p-4 sm:p-6 lg:p-8 font-sans">
            {/* হেডার */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-[#E8E1D9] gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-medium tracking-wide text-[#2C2724]">
                        কম্বো প্যাকেজ ব্যবস্থাপনা
                    </h1>
                    <p className="mt-1 text-sm text-[#70645C]">
                        মোট প্যাকেজ: <span className="font-semibold text-[#2C2724]">{meta.total} টি</span>
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/add-combo"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2724] hover:bg-[#2C2724]/90 active:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    নতুন কম্বো তৈরি করুন
                </Link>
            </div>

            {/* কম্বো টেবিল */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E1D9] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF8F5] border-b border-[#E8E1D9] text-[#70645C] text-[11px] font-semibold uppercase tracking-wider">
                                <th className="py-4 px-4 sm:px-6">প্যাকেজ</th>
                                <th className="py-4 px-4">আইটেম সংখ্যা</th>
                                <th className="py-4 px-4">মূল্য বিবরণ</th>
                                <th className="py-4 px-4">স্টক</th>
                                <th className="py-4 px-4">অবস্থা</th>
                                <th className="py-4 px-4 sm:px-6 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E1D9] text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[#8C7A6B]">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-6 h-6 border-2 border-[#9E7B66] border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs">লোড হচ্ছে...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : combos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[#8C7A6B]">
                                        কোনো কম্বো প্যাকেজ তৈরি করা হয়নি।
                                    </td>
                                </tr>
                            ) : (
                                combos.map((combo) => {
                                    const savings = Math.max(0, combo.originalPrice - combo.comboPrice);

                                    return (
                                        <tr key={combo._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                                            {/* ব্যানার ও টাইটেল */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-14 h-12 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={combo.bannerImage || "/placeholder.png"}
                                                            alt={combo.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-xs sm:text-sm text-[#2C2724] truncate max-w-xs">
                                                            {combo.title}
                                                        </p>
                                                        <p className="text-[11px] text-[#8C7A6B] font-mono truncate max-w-xs">
                                                            /{combo.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* আইটেম সংখ্যা */}
                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4ECE4] text-[#2C2724] rounded-md text-xs font-medium">
                                                    <Layers className="w-3.5 h-3.5 text-[#9E7B66]" />
                                                    {combo.products?.length || 0} টি পণ্য
                                                </span>
                                            </td>

                                            {/* মূল্য */}
                                            <td className="py-4 px-4">
                                                <div className="font-semibold text-xs sm:text-sm text-[#2C2724]">
                                                    ৳{combo.comboPrice}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px]">
                                                    <span className="line-through text-[#8C7A6B]">
                                                        ৳{combo.originalPrice}
                                                    </span>
                                                    {savings > 0 && (
                                                        <span className="text-[#A8483B] font-medium">
                                                            (সাশ্রয় ৳{savings})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* স্টক */}
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`text-xs font-semibold ${combo.stock > 0 ? "text-[#2C2724]" : "text-[#A8483B]"
                                                        }`}
                                                >
                                                    {combo.stock > 0 ? `${combo.stock} টি` : "স্টক আউট"}
                                                </span>
                                            </td>

                                            {/* স্ট্যাটাস */}
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${combo.isActive
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-rose-50 text-rose-700 border border-rose-200"
                                                        }`}
                                                >
                                                    {combo.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                                </span>
                                            </td>

                                            {/* অ্যাকশন বাটনসমূহ */}
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    {/* ভিউ বাটন */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedCombo(combo)}
                                                        className="p-2 text-[#70645C] hover:text-[#2C2724] hover:bg-[#F4ECE4] rounded-lg transition-colors"
                                                        title="বিস্তারিত দেখুন"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* এডিট বাটন */}
                                                    <Link
                                                        href={`/dashboard/admin/manage-combos/edit/${combo._id}`}
                                                        className="p-2 text-[#9E7B66] hover:text-[#70645C] hover:bg-[#F4ECE4] rounded-lg transition-colors"
                                                        title="সম্পাদনা করুন"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>

                                                    {/* ডিলিট বাটন */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(combo._id, combo.title)}
                                                        className="p-2 text-[#A8483B] hover:text-[#C55043] hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="মুছে ফেলুন"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* পেজিনেশন */}
                {meta.totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-[#E8E1D9] bg-[#FAF8F5]">
                        <p className="text-xs text-[#70645C]">
                            পৃষ্ঠা <span className="font-semibold text-[#2C2724]">{meta.page}</span> / {meta.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={meta.page <= 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                className="p-2 border border-[#E8E1D9] bg-white rounded-lg text-[#2C2724] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4ECE4] transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                disabled={meta.page >= meta.totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="p-2 border border-[#E8E1D9] bg-white rounded-lg text-[#2C2724] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4ECE4] transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ভিউ মডাল */}
            {selectedCombo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in duration-200">
                        <button
                            onClick={() => setSelectedCombo(null)}
                            className="absolute top-4 right-4 p-2 text-[#70645C] hover:text-[#2C2724] hover:bg-[#E8E1D9]/50 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-bold text-[#2C2724] pb-3 border-b border-[#E8E1D9]">
                            কম্বো প্যাকেজ প্রিভিউ
                        </h2>

                        <div className="mt-4 space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#E8E1D9] bg-white">
                                <img
                                    src={selectedCombo.bannerImage}
                                    alt={selectedCombo.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-[#70645C] block">প্যাকেজ নাম:</span>
                                    <span className="font-semibold text-[#2C2724]">{selectedCombo.title}</span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">স্লাগ:</span>
                                    <span className="font-mono text-[#2C2724]">/{selectedCombo.slug}</span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">কম্বো মূল্য:</span>
                                    <span className="font-semibold text-[#2C2724]">৳{selectedCombo.comboPrice}</span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">আসল মূল্য:</span>
                                    <span className="line-through text-[#70645C]">৳{selectedCombo.originalPrice}</span>
                                </div>
                            </div>

                            {selectedCombo.videoUrl && (
                                <div className="text-xs">
                                    <span className="text-[#70645C] block mb-1">ভিডিও লিংক:</span>
                                    <a
                                        href={selectedCombo.videoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-[#9E7B66] hover:underline"
                                    >
                                        {selectedCombo.videoUrl} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}

                            <div>
                                <span className="text-xs text-[#70645C] block mb-1">বিবরণ:</span>
                                <p className="text-xs text-[#2C2724] bg-white p-3 rounded-lg border border-[#E8E1D9] leading-relaxed whitespace-pre-wrap">
                                    {selectedCombo.description}
                                </p>
                            </div>

                            {/* পণ্য তালিকা */}
                            <div>
                                <span className="text-xs font-semibold text-[#70645C] block mb-2">
                                    প্যাকেজের অন্তর্ভুক্ত পণ্যসমূহ:
                                </span>
                                <div className="space-y-2">
                                    {selectedCombo.products?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 bg-white border border-[#E8E1D9] rounded-lg text-xs flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-10 h-10 object-cover rounded-md border border-[#E8E1D9]"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-[#2C2724]">{item.title}</p>
                                                    <p className="text-[#8C7A6B] text-[11px]">পরিমাণ: {item.quantity} টি</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2 border-t border-[#E8E1D9]">
                                <Link
                                    href={`/dashboard/admin/manage-combos/edit/${selectedCombo._id}`}
                                    className="px-5 py-2.5 bg-[#2C2724] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
                                >
                                    এডিট পেজে যান
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}