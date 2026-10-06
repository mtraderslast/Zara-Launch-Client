"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Search, Eye, Edit3, Trash2, ChevronLeft, ChevronRight,
    Loader2, CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw, X,
    Layers, PackageCheck, MapPin, Phone, User
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "@/lib/action/order";

const STATUS_BADGES = {
    Pending: { label: "পেন্ডিং", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
    Processing: { label: "প্রসেসিং", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: RefreshCw },
    Delivered: { label: "ডেলিভার্ড", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    Cancelled: { label: "বাতিল", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle },
};

export default function ComboOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

    // ফিল্টার স্টেট
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // মডাল স্টেট
    const [viewOrder, setViewOrder] = useState(null);
    const [editOrder, setEditOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    // ডাটা লোড ফাংশন
    const loadOrders = useCallback(async (page = 1, status = selectedStatus) => {
        try {
            setLoading(true);
            const params = {
                orderType: "combo", // কম্বো অর্ডারের জন্য স্পেসিফিক ফিল্টার
                page,
                limit: meta.limit,
            };
            if (status) params.status = status;

            const res = await fetchAllOrders(params);

            // রেসপন্স ডাটা নিরাপদভাবে এক্সট্র্যাক্ট করা
            let ordersList = [];
            let metaData = { page: 1, limit: 10, total: 0, totalPages: 1 };

            if (Array.isArray(res)) {
                ordersList = res;
            } else if (Array.isArray(res?.data)) {
                ordersList = res.data;
                if (res.meta) metaData = res.meta;
            } else if (Array.isArray(res?.data?.data)) {
                ordersList = res.data.data;
                if (res.data.meta) metaData = res.data.meta;
            }

            setOrders(ordersList);
            setMeta(metaData);
        } catch (error) {
            console.error("Combo orders fetch error:", error);
            Swal.fire({
                icon: "error",
                title: "ডাটা লোড ব্যর্থ হয়েছে",
                text: error?.response?.data?.message || "কম্বো অর্ডার তালিকা লোড করতে সমস্যা হয়েছে।",
                confirmButtonColor: "#2C2724",
            });
        } finally {
            setLoading(false);
        }
    }, [meta.limit, selectedStatus]);

    useEffect(() => {
        loadOrders(1, selectedStatus);
    }, [selectedStatus]);

    // স্ট্যাটাস ফিল্টার পরিবর্তন
    const handleStatusFilterChange = (status) => {
        setSelectedStatus(status);
    };

    // স্ট্যাটাস আপডেট সাবমিট
    const handleUpdateStatusSubmit = async (e) => {
        e.preventDefault();
        if (!editOrder || !newStatus) return;

        setUpdatingStatus(true);
        try {
            await updateOrderStatus(editOrder._id, { status: newStatus });

            Swal.fire({
                icon: "success",
                title: "স্ট্যাটাস আপডেট হয়েছে",
                text: `কম্বো অর্ডারের স্ট্যাটাস সফলভাবে "${newStatus}" করা হয়েছে।`,
                confirmButtonColor: "#2C2724",
                timer: 1800,
                showConfirmButton: false,
            });

            setEditOrder(null);
            loadOrders(meta.page, selectedStatus);
        } catch (error) {
            console.error("Status update error:", error);
            Swal.fire({
                icon: "error",
                title: "আপডেট ব্যর্থ হয়েছে",
                text: error?.response?.data?.message || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।",
                confirmButtonColor: "#A8483B",
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    // ডিলিট হ্যান্ডলার
    const handleDeleteOrder = async (orderId) => {
        const confirmResult = await Swal.fire({
            title: "কম্বো অর্ডারটি মুছে ফেলতে চান?",
            text: "ডিলিট করার পর এই অর্ডারের ডাটা আর উদ্ধার করা যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#A8483B",
            cancelButtonColor: "#7C6E65",
            confirmButtonText: "হ্যাঁ, ডিলিট করুন",
            cancelButtonText: "বাতিল",
        });

        if (confirmResult.isConfirmed) {
            try {
                await deleteOrder(orderId);
                Swal.fire({
                    icon: "success",
                    title: "ডিলিট সম্পন্ন!",
                    text: "কম্বো অর্ডারটি সফলভাবে মুছে ফেলা হয়েছে।",
                    confirmButtonColor: "#2C2724",
                    timer: 1500,
                    showConfirmButton: false,
                });
                loadOrders(meta.page, selectedStatus);
            } catch (error) {
                console.error("Delete combo order error:", error);
                Swal.fire({
                    icon: "error",
                    title: "ডিলিট ব্যর্থ হয়েছে",
                    text: error?.response?.data?.message || "অর্ডার মুছে ফেলা সম্ভব হয়নি।",
                    confirmButtonColor: "#A8483B",
                });
            }
        }
    };

    // ক্লায়েন্ট-সাইড ফিল্টারিং
    const filteredOrders = orders.filter((order) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const firstItemTitle = order.items?.[0]?.title?.toLowerCase() || "";
        return (
            order.name?.toLowerCase().includes(q) ||
            order.phone?.includes(q) ||
            order._id?.toLowerCase().includes(q) ||
            firstItemTitle.includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-[#FAF8F5] p-4 sm:p-6 lg:p-8 text-[#2C2724]">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* হেডার */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E1D9] pb-5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#2C2724] text-[#E0C9A6] flex items-center justify-center shadow-xs">
                                <Layers className="w-4 h-4" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2C2724]">
                                কম্বো প্যাকেজ অর্ডারসমূহ
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFE8DF] text-[#7C6E65]">
                                {meta.total} টি প্যাকেজ
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#7C6E65] mt-1">
                            সরাসরি কম্বো ও বান্ডেল অফার থেকে আসা অর্ডারের বিবরণ ও কন্ট্রোল প্যানেল
                        </p>
                    </div>

                    <button
                        onClick={() => loadOrders(meta.page, selectedStatus)}
                        disabled={loading}
                        className="self-start sm:self-auto px-4 py-2 bg-white border border-[#E8E1D9] rounded-xl text-xs font-semibold text-[#5C534D] hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        <span>রিফ্রেশ</span>
                    </button>
                </div>

                {/* ফিল্টার এবং সার্চ বার */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E1D9] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="নাম, ফোন বা প্যাকেজের নাম..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9E7B66]"
                        />
                    </div>

                    {/* স্ট্যাটাস ফিল্টার বাটনসমূহ */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        {[
                            { key: "", label: "সকল" },
                            { key: "Pending", label: "পেন্ডিং" },
                            { key: "Processing", label: "প্রসেসিং" },
                            { key: "Delivered", label: "ডেলিভার্ড" },
                            { key: "Cancelled", label: "বাতিল" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleStatusFilterChange(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedStatus === tab.key
                                        ? "bg-[#2C2724] text-white shadow-xs"
                                        : "bg-[#FAF8F5] text-[#7C6E65] hover:bg-[#EFE8DF]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* কম্বো অর্ডার টেবিল */}
                <div className="bg-white rounded-2xl border border-[#E8E1D9] shadow-xs overflow-hidden">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-[#9E7B66] animate-spin" />
                            <p className="text-xs text-[#7C6E65]">কম্বো অর্ডার লোড হচ্ছে...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-20 text-center space-y-2">
                            <AlertCircle className="w-10 h-10 text-[#8C7A6B] mx-auto" />
                            <h3 className="font-semibold text-sm text-[#2C2724]">কোনো কম্বো অর্ডার পাওয়া যায়নি</h3>
                            <p className="text-xs text-[#7C6E65]">আপনার বর্তমান ফিল্টারের সাথে কোনো ডাটা মিলছে না।</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-[#FAF8F5] border-b border-[#E8E1D9] text-[#7C6E65] text-[11px] uppercase tracking-wider font-semibold">
                                        <th className="py-3.5 px-4">অর্ডার আইডি ও তারিখ</th>
                                        <th className="py-3.5 px-4">গ্রাহক বিবরণ</th>
                                        <th className="py-3.5 px-4">প্যাকেজের তথ্য</th>
                                        <th className="py-3.5 px-4">লোকেশন</th>
                                        <th className="py-3.5 px-4">মোট বিল</th>
                                        <th className="py-3.5 px-4">পেমেন্ট</th>
                                        <th className="py-3.5 px-4">স্ট্যাটাস</th>
                                        <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F2ECE4]">
                                    {filteredOrders.map((order) => {
                                        const badge = STATUS_BADGES[order.status] || STATUS_BADGES.Pending;
                                        const BadgeIcon = badge.icon;
                                        const comboItem = order.items?.[0] || {};

                                        return (
                                            <tr key={order._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                                {/* আইডি ও তারিখ */}
                                                <td className="py-3.5 px-4 font-mono">
                                                    <span className="font-bold text-[#2C2724]">#{order._id.slice(-6)}</span>
                                                    <span className="block text-[11px] text-[#8C7A6B] font-sans">
                                                        {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </td>

                                                {/* গ্রাহক */}
                                                <td className="py-3.5 px-4">
                                                    <span className="font-semibold text-[#2C2724] block">{order.name}</span>
                                                    <span className="text-xs text-[#7C6E65]">{order.phone}</span>
                                                </td>

                                                {/* কম্বো প্যাকেজ ছবি ও নাম */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2.5 max-w-[240px]">
                                                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] overflow-hidden shrink-0">
                                                            <img
                                                                src={comboItem.image || "/placeholder.jpg"}
                                                                alt={comboItem.title || "Combo"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="truncate">
                                                            <span className="font-semibold text-xs text-[#2C2724] block truncate">
                                                                {comboItem.title || "কম্বো অফার"}
                                                            </span>
                                                            <span className="text-[11px] text-[#8C7A6B]">
                                                                পরিমাণ: {comboItem.quantity || 1} টি প্যাকেজ
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ডেলিভারি লোকেশন */}
                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF8F5] border border-[#E8E1D9]">
                                                        {order.deliveryLocation === "inside_dhaka" ? "ঢাকা সিটি" : "ঢাকার বাইরে"}
                                                    </span>
                                                </td>

                                                {/* মোট প্রদেয় */}
                                                <td className="py-3.5 px-4 font-bold text-[#2C2724]">
                                                    ৳{order.totalPrice?.toLocaleString("bn-BD")}
                                                </td>

                                                {/* পেমেন্ট স্ট্যাটাস */}
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentStatus === "Paid"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-amber-50 text-amber-700"
                                                        }`}>
                                                        {order.paymentStatus === "Paid" ? "পরিশোধিত" : "বকেয়া (COD)"}
                                                    </span>
                                                </td>

                                                {/* স্ট্যাটাস ব্যাজ */}
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                                                        <BadgeIcon className="w-3 h-3" />
                                                        <span>{badge.label}</span>
                                                    </span>
                                                </td>

                                                {/* অ্যাকশন বাটন ৩টি */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {/* ১. ভিউ বাটন */}
                                                        <button
                                                            onClick={() => setViewOrder(order)}
                                                            title="কম্বো ডিটেইলস দেখুন"
                                                            className="p-1.5 rounded-lg text-[#5C534D] bg-[#FAF8F5] hover:bg-[#EFE8DF] transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {/* ২. এডিট স্ট্যাটাস বাটন */}
                                                        <button
                                                            onClick={() => {
                                                                setEditOrder(order);
                                                                setNewStatus(order.status);
                                                            }}
                                                            title="স্ট্যাটাস পরিবর্তন করুন"
                                                            className="p-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>

                                                        {/* ৩. ডিলিট বাটন */}
                                                        <button
                                                            onClick={() => handleDeleteOrder(order._id)}
                                                            title="অর্ডার মুছে ফেলুন"
                                                            className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* পেজিনেশন */}
                    {!loading && meta.totalPages > 1 && (
                        <div className="py-4 px-6 border-t border-[#E8E1D9] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-[#7C6E65]">
                                পৃষ্ঠা <strong>{meta.page}</strong> এর <strong>{meta.totalPages}</strong> (মোট {meta.total} টি কম্বো অর্ডার)
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => loadOrders(meta.page - 1, selectedStatus)}
                                    disabled={meta.page <= 1}
                                    className="p-2 rounded-lg border border-[#E8E1D9] bg-white text-[#2C2724] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pg) => {
                                    if (
                                        pg === 1 ||
                                        pg === meta.totalPages ||
                                        (pg >= meta.page - 1 && pg <= meta.page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pg}
                                                onClick={() => loadOrders(pg, selectedStatus)}
                                                className={`w-8 h-8 rounded-lg font-semibold transition-all ${meta.page === pg
                                                        ? "bg-[#2C2724] text-white"
                                                        : "border border-[#E8E1D9] bg-white text-[#7C6E65] hover:bg-[#EFE8DF]"
                                                    }`}
                                            >
                                                {pg}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => loadOrders(meta.page + 1, selectedStatus)}
                                    disabled={meta.page >= meta.totalPages}
                                    className="p-2 rounded-lg border border-[#E8E1D9] bg-white text-[#2C2724] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ১. ভিউ অর্ডার ডিটেইলস মডাল */}
            {viewOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E8E1D9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 sm:p-5 border-b border-[#E8E1D9] flex items-center justify-between bg-[#FAF8F5]">
                            <div className="flex items-center gap-2">
                                <PackageCheck className="w-5 h-5 text-[#9E7B66]" />
                                <div>
                                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C2724]">
                                        কম্বো প্যাকেজ অর্ডার বিস্তারিত
                                    </h3>
                                    <span className="text-[11px] font-mono text-[#8C7A6B]">
                                        #{viewOrder._id}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewOrder(null)}
                                className="p-1 rounded-lg hover:bg-[#EFE8DF] text-[#7C6E65] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
                            {/* গ্রাহক তথ্য কার্ড */}
                            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] block mb-0.5">
                                            গ্রাহকের নাম
                                        </span>
                                        <p className="font-bold text-[#2C2724] text-sm">{viewOrder.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] block mb-0.5">
                                            মোবাইল নম্বর
                                        </span>
                                        <p className="font-semibold text-[#2C2724]">{viewOrder.phone}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-[#E8E1D9]">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] block mb-0.5">
                                        ডেলিভারি ঠিকানা
                                    </span>
                                    <p className="text-[#5C534D] leading-relaxed whitespace-pre-line">{viewOrder.address}</p>
                                    <span className="inline-block mt-1 text-[11px] font-semibold text-[#9E7B66]">
                                        {viewOrder.deliveryLocation === "inside_dhaka" ? "ঢাকার ভিতরে (ডেলিভারি: ৳৭০)" : "ঢাকার বাইরে (ডেলিভারি: ৳১৩০)"}
                                    </span>
                                </div>

                                {viewOrder.note && (
                                    <div className="pt-2 border-t border-[#E8E1D9]">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] block mb-0.5">
                                            গ্রাহকের নোট
                                        </span>
                                        <p className="italic text-[#2C2724]">"{viewOrder.note}"</p>
                                    </div>
                                )}
                            </div>

                            {/* প্যাকেজ কার্ড */}
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-[#7C6E65] mb-2">
                                    অর্ডারকৃত প্যাকেজ
                                </h4>
                                <div className="border border-[#E8E1D9] rounded-xl p-3 bg-white space-y-3">
                                    {viewOrder.items?.map((item, index) => (
                                        <div key={index} className="flex gap-3.5 items-center">
                                            <div className="w-16 h-16 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] overflow-hidden shrink-0">
                                                <img
                                                    src={item.image || "/placeholder.jpg"}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-sm text-[#2C2724] truncate">
                                                    {item.title}
                                                </h5>
                                                <span className="inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E1D9] text-[#7C6E65]">
                                                    প্যাকেজ অর্ডার
                                                </span>
                                                <p className="text-xs text-[#8C7A6B] mt-1">
                                                    ৳{item.price?.toLocaleString("bn-BD")} × {item.quantity} টি
                                                </p>
                                            </div>
                                            <div className="text-right font-bold text-sm text-[#2C2724]">
                                                ৳{(item.price * item.quantity).toLocaleString("bn-BD")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* হিসাব বিবরণী */}
                            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] space-y-2 text-xs">
                                <div className="flex justify-between text-[#7C6E65]">
                                    <span>প্যাকেজ মূল্য:</span>
                                    <span>৳{(viewOrder.totalPrice - (viewOrder.shippingCharge || 0)).toLocaleString("bn-BD")}</span>
                                </div>
                                <div className="flex justify-between text-[#7C6E65]">
                                    <span>ডেলিভারি চার্জ:</span>
                                    <span>৳{(viewOrder.shippingCharge || 0).toLocaleString("bn-BD")}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-[#2C2724] pt-2 border-t border-[#E8E1D9]">
                                    <span>সর্বমোট প্রদেয়:</span>
                                    <span className="text-[#9E7B66]">৳{viewOrder.totalPrice?.toLocaleString("bn-BD")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#E8E1D9] bg-[#FAF8F5] flex justify-end">
                            <button
                                onClick={() => setViewOrder(null)}
                                className="px-5 py-2 bg-[#2C2724] text-white rounded-xl text-xs font-semibold hover:bg-[#3E3733] transition-colors"
                            >
                                বন্ধ করুন
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ২. এডিট স্ট্যাটাস মডাল */}
            {editOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl border border-[#E8E1D9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-[#E8E1D9] flex items-center justify-between bg-[#FAF8F5]">
                            <h3 className="font-bold text-sm text-[#2C2724]">
                                কম্বো অর্ডার স্ট্যাটাস আপডেট
                            </h3>
                            <button
                                onClick={() => setEditOrder(null)}
                                className="p-1 rounded-lg hover:bg-[#EFE8DF] text-[#7C6E65] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStatusSubmit} className="p-5 space-y-4">
                            <div>
                                <p className="text-xs text-[#7C6E65] mb-2">
                                    অর্ডার আইডি: <span className="font-bold text-[#2C2724]">#{editOrder._id.slice(-6)}</span>
                                </p>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C534D] mb-1.5">
                                    নতুন স্ট্যাটাস নির্ধারণ করুন
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl text-xs font-semibold text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                >
                                    <option value="Pending">Pending (পেন্ডিং)</option>
                                    <option value="Processing">Processing (প্রসেসিং)</option>
                                    <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                                    <option value="Cancelled">Cancelled (বাতিল)</option>
                                </select>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditOrder(null)}
                                    className="px-4 py-2 border border-[#E8E1D9] text-[#7C6E65] rounded-xl text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatingStatus}
                                    className="px-4 py-2 bg-[#2C2724] text-white rounded-xl text-xs font-semibold hover:bg-[#3E3733] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {updatingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>আপডেট করুন</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}