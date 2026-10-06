"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    Sparkles,
    Layers,
    Tag,
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchAllProducts, deleteProduct } from "@/lib/action/products";

const categoryList = [
    { label: "সব ক্যাটাগরি", value: "ALL" },
    { label: "পোশাক (Clothing)", value: "Clothing" },
    { label: "সুগন্ধি (Fragrance)", value: "Fragrance" },
];

export default function ManageProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                ...(search.trim() && { search: search.trim() }),
                ...(category !== "ALL" && { category }),
                ...(status !== "ALL" && { status }),
            };

            const response = await fetchAllProducts(params);
            if (response?.success) {
                setProducts(response.data || []);
                if (response.meta) {
                    setMeta(response.meta);
                }
            }
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    }, [page, category, status, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadProducts();
        }, 300);
        return () => clearTimeout(debounce);
    }, [loadProducts]);

    // ডিলিট হ্যান্ডলার
    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: `"${title}" পণ্যটি সম্পূর্ণভাবে মুছে ফেলা হবে!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#A8483B",
            cancelButtonColor: "#70645C",
            confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
            cancelButtonText: "বাতিল",
            background: "#FAF8F5",
            color: "#2C2724",
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteProduct(id);
                if (response?.success) {
                    Swal.fire({
                        icon: "success",
                        title: "মুছে ফেলা হয়েছে!",
                        text: "পণ্যটি সফলভাবে মুছে ফেলা হয়েছে।",
                        confirmButtonColor: "#2C2724",
                    });
                    setProducts((prev) => prev.filter((item) => item._id !== id));
                    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "ব্যর্থ হয়েছে",
                        text: response?.message || "পণ্য মুছতে সমস্যা হয়েছে।",
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
                        পণ্য ব্যবস্থাপনা (Products)
                    </h1>
                    <p className="mt-1 text-sm text-[#70645C]">
                        মোট পণ্য: <span className="font-semibold text-[#2C2724]">{meta.total} টি</span>
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/add-product"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2724] hover:bg-[#2C2724]/90 active:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    নতুন পণ্য যোগ করুন
                </Link>
            </div>

            {/* ফিল্টার ও সার্চ বার */}
            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8E1D9] mb-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* সার্চ বক্স */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="নাম বা ট্যাগ দিয়ে খুঁজুন..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-xs sm:text-sm text-[#2C2724] placeholder-[#8C7A6B]/60 focus:outline-none focus:border-[#9E7B66]"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#2C2724]"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* ক্যাটাগরি ফিল্টার */}
                    <div>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-xs sm:text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] cursor-pointer"
                        >
                            {categoryList.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* স্ট্যাটাস ফিল্টার */}
                    <div>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-xs sm:text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] cursor-pointer"
                        >
                            <option value="ALL">সব স্ট্যাটাস</option>
                            <option value="active">সক্রিয় (Active)</option>
                            <option value="draft">ড্রাফট (Draft)</option>
                        </select>
                    </div>

                    {/* ফিল্টার রিসেট বাটন */}
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCategory("ALL");
                                setStatus("ALL");
                                setPage(1);
                            }}
                            className="w-full py-2.5 px-4 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#70645C] hover:text-[#2C2724] border border-[#E8E1D9] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Filter className="w-3.5 h-3.5" /> ফিল্টার রিসেট
                        </button>
                    </div>
                </div>
            </div>

            {/* প্রোডাক্ট টেবিল */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E1D9] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF8F5] border-b border-[#E8E1D9] text-[#70645C] text-[11px] font-semibold uppercase tracking-wider">
                                <th className="py-4 px-4 sm:px-6">পণ্য</th>
                                <th className="py-4 px-4">ক্যাটাগরি</th>
                                <th className="py-4 px-4">মূল্য ও ছাড়</th>
                                <th className="py-4 px-4">স্ট্যাটাস</th>
                                <th className="py-4 px-4">ভ্যারিয়েন্ট</th>
                                <th className="py-4 px-4 sm:px-6 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E1D9] text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[#8C7A6B]">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-6 h-6 border-2 border-[#9E7B66] border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs">পণ্য লোড হচ্ছে...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[#8C7A6B]">
                                        কোনো পণ্য খুঁজে পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => {
                                    const finalPrice =
                                        item.discountRate > 0
                                            ? Math.round(item.price - (item.price * item.discountRate) / 100)
                                            : item.price;

                                    return (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-[#FAF8F5]/60 transition-colors"
                                        >
                                            {/* ছবি ও নাম */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.images?.[0] || "/placeholder.png"}
                                                            alt={item.titleEn}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-semibold text-xs sm:text-sm text-[#2C2724] truncate max-w-[200px] sm:max-w-xs">
                                                                {item.titleBn}
                                                            </p>
                                                            {item.isFeatured && (
                                                                <span
                                                                    title="Featured Product"
                                                                    className="flex items-center text-amber-600 bg-amber-50 p-0.5 rounded"
                                                                >
                                                                    <Sparkles className="w-3.5 h-3.5" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-[#8C7A6B] truncate max-w-[200px] sm:max-w-xs">
                                                            {item.titleEn}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* ক্যাটাগরি */}
                                            <td className="py-4 px-4">
                                                <span className="inline-block px-2.5 py-1 bg-[#F4ECE4] text-[#2C2724] rounded-md text-xs font-medium">
                                                    {item.category}
                                                </span>
                                                {item.subCategory && (
                                                    <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                                                        {item.subCategory}
                                                    </p>
                                                )}
                                            </td>

                                            {/* মূল্য */}
                                            <td className="py-4 px-4">
                                                <div className="font-semibold text-xs sm:text-sm text-[#2C2724]">
                                                    ৳{finalPrice}
                                                </div>
                                                {item.discountRate > 0 && (
                                                    <div className="flex items-center gap-1 text-[11px]">
                                                        <span className="line-through text-[#8C7A6B]">
                                                            ৳{item.price}
                                                        </span>
                                                        <span className="text-[#A8483B] font-medium">
                                                            (-{item.discountRate}%)
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* স্ট্যাটাস */}
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                                        }`}
                                                >
                                                    {item.status === "active" ? "সক্রিয়" : "ড্রাফট"}
                                                </span>
                                            </td>

                                            {/* ভ্যারিয়েন্ট তথ্য */}
                                            <td className="py-4 px-4">
                                                {item.hasVariants ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-[#70645C] bg-[#FAF8F5] px-2 py-1 rounded border border-[#E8E1D9]">
                                                        <Layers className="w-3 h-3 text-[#9E7B66]" />
                                                        {item.variants?.length || 0} টি ভ্যারিয়েন্ট
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-[#8C7A6B]">স্ট্যান্ডার্ড</span>
                                                )}
                                            </td>

                                            {/* অ্যাকশন বাটনসমূহ */}
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    {/* ভিউ বাটন */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedProduct(item)}
                                                        className="p-2 text-[#70645C] hover:text-[#2C2724] hover:bg-[#F4ECE4] rounded-lg transition-colors"
                                                        title="বিস্তারিত দেখুন"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* এডিট বাটন -> আলাদা এডিট পেজে যাবে */}
                                                    <Link
                                                        href={`/dashboard/admin/edit/${item._id}`}
                                                        className="p-2 text-[#9E7B66] hover:text-[#70645C] hover:bg-[#F4ECE4] rounded-lg transition-colors"
                                                        title="সম্পাদনা করুন"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>

                                                    {/* ডিলিট বাটন */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item._id, item.titleBn)}
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
                            পৃষ্ঠা <span className="font-semibold text-[#2C2724]">{meta.page}</span> /{" "}
                            {meta.totalPages}
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

            {/* ভিউ কুইক প্রিভিউ মডাল */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in duration-200">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 text-[#70645C] hover:text-[#2C2724] hover:bg-[#E8E1D9]/50 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-bold text-[#2C2724] pb-3 border-b border-[#E8E1D9]">
                            পণ্যের বিবরণ প্রিভিউ
                        </h2>

                        <div className="mt-4 space-y-4">
                            {/* ছবি গ্যালারি */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {selectedProduct.images?.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border border-[#E8E1D9] flex-shrink-0"
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-[#70645C] block">বাংলা নাম:</span>
                                    <span className="font-semibold text-[#2C2724]">{selectedProduct.titleBn}</span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">ইংরেজি নাম:</span>
                                    <span className="font-semibold text-[#2C2724]">{selectedProduct.titleEn}</span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">স্লাগ:</span>
                                    <span className="font-mono text-[#2C2724]">{selectedProduct.slug}</span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">ক্যাটাগরি / সাব-ক্যাটাগরি:</span>
                                    <span className="font-semibold text-[#2C2724]">
                                        {selectedProduct.category} {selectedProduct.subCategory && `> ${selectedProduct.subCategory}`}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">মূল্য ও ছাড়:</span>
                                    <span className="font-semibold text-[#2C2724]">
                                        ৳{selectedProduct.price} (ছাড়: {selectedProduct.discountRate}%)
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[#70645C] block">ব্র্যান্ড:</span>
                                    <span className="font-semibold text-[#2C2724]">
                                        {selectedProduct.brand || "—"}
                                    </span>
                                </div>
                            </div>

                            {/* বিবরণ */}
                            <div className="pt-2">
                                <span className="text-xs text-[#70645C] block mb-1">বিবরণ:</span>
                                <p className="text-xs text-[#2C2724] bg-white p-3 rounded-lg border border-[#E8E1D9] leading-relaxed whitespace-pre-wrap">
                                    {selectedProduct.descriptionBn}
                                </p>
                            </div>

                            {/* ট্যাগ */}
                            {selectedProduct.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {selectedProduct.tags.map((t, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 bg-[#F4ECE4] text-[#2C2724] rounded-md text-[11px] font-medium border border-[#E8E1D9]"
                                        >
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* ভ্যারিয়েন্ট তালিকা */}
                            {selectedProduct.hasVariants && selectedProduct.variants?.length > 0 && (
                                <div className="pt-2">
                                    <span className="text-xs font-semibold text-[#70645C] block mb-2">
                                        ভ্যারিয়েন্ট তালিকা ({selectedProduct.variants.length} টি):
                                    </span>
                                    <div className="space-y-2">
                                        {selectedProduct.variants.map((v, i) => (
                                            <div
                                                key={i}
                                                className="p-2.5 bg-white border border-[#E8E1D9] rounded-lg text-xs flex justify-between items-center"
                                            >
                                                <div>
                                                    <span className="font-semibold text-[#2C2724]">
                                                        {v.sku ? `SKU: ${v.sku} | ` : ""}
                                                    </span>
                                                    <span>
                                                        স্টক: {v.stock} টি {v.price ? `| মূল্য: ৳${v.price}` : ""}
                                                    </span>
                                                    <div className="text-[11px] text-[#8C7A6B] mt-0.5">
                                                        {v.attributes &&
                                                            Object.entries(v.attributes).map(
                                                                ([k, val]) => `${k}: ${val}`
                                                            ).join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-2 border-t border-[#E8E1D9]">
                                <Link
                                    href={`/dashboard/admin/edit/${selectedProduct._id}`}
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