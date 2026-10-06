"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Search,
    Package,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    MapPin,
    Phone,
    User,
    Calendar,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { trackGuestOrder } from "@/lib/action/order";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initialTrackingId = searchParams.get("trackingId") || "";

    const [trackingInput, setTrackingInput] = useState(initialTrackingId);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrder = async (idToSearch) => {
        const id = idToSearch?.trim();
        if (!id) return;

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await trackGuestOrder(id);
            const data = res?.data?.data || res?.data;
            if (data) {
                setOrder(data);
            } else {
                setError("এই ট্র্যাকিং আইডির কোনো অর্ডার পাওয়া যায়নি।");
            }
        } catch (err) {
            console.error("Tracking error:", err);
            const msg =
                err?.response?.data?.message ||
                "অর্ডারের তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক ট্র্যাকিং আইডি দিন।";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialTrackingId) {
            setTrackingInput(initialTrackingId);
            fetchOrder(initialTrackingId);
        }
    }, [initialTrackingId]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrder(trackingInput);
    };

    // স্ট্যাটাস স্টেপ ক্যালকুলেশন
    const steps = [
        { key: "Pending", label: "অর্ডার গ্রহণ", icon: Clock },
        { key: "Processing", label: "প্রসেসিং হচ্ছে", icon: Package },
        { key: "Delivered", label: "ডেলিভারি সম্পন্ন", icon: CheckCircle2 },
    ];

    const getStepStatus = (stepKey, currentStatus) => {
        if (currentStatus === "Cancelled") return "cancelled";
        const orderIndex = steps.findIndex((s) => s.key === currentStatus);
        const stepIndex = steps.findIndex((s) => s.key === stepKey);

        if (stepIndex < orderIndex) return "completed";
        if (stepIndex === orderIndex) return "active";
        return "upcoming";
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* হেডার ও ব্যাক বাটন */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#70645C] hover:text-[#2C2724] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>হোমে ফিরে যান</span>
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#2C2724]">
                    অর্ডার ট্র্যাকিং
                </h1>
                <div className="w-16"></div>
            </div>

            {/* সার্চ ফর্ম */}
            <div className="bg-white border border-[#E8E1D9] rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#8C7A6B] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="আপনার ট্র্যাকিং আইডি লিখুন (যেমন: TRK-123456)"
                            className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl text-sm text-[#2C2724] focus:outline-none focus:bg-white focus:border-[#9E7B66] uppercase"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-3 px-6 bg-[#2C2724] hover:bg-[#3E3733] text-[#FAF8F5] text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>খোঁজা হচ্ছে...</span>
                            </>
                        ) : (
                            <span>ট্র্যাক করুন</span>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* অর্ডার ডিটেইলস কার্ড */}
            {order && (
                <div className="space-y-6">
                    {/* স্ট্যাটাস ও ট্র্যাকিং ওভারভিউ */}
                    <div className="bg-white border border-[#E8E1D9] rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E1D9] gap-3">
                            <div>
                                <span className="text-xs text-[#8C7A6B] font-medium">ট্র্যাকিং নম্বর:</span>
                                <h2 className="text-lg font-mono font-bold text-[#2C2724]">
                                    {order.trackingId}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#70645C]">
                                <Calendar className="w-4 h-4 text-[#9E7B66]" />
                                <span>
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString("bn-BD", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* স্ট্যাটাস বার */}
                        <div className="py-8">
                            {order.status === "Cancelled" ? (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <h3 className="text-sm font-bold text-red-600">অর্ডারটি বাতিল করা হয়েছে</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 relative">
                                    {steps.map((step, index) => {
                                        const status = getStepStatus(step.key, order.status);
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center text-center">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${status === "completed"
                                                            ? "bg-[#2C2724] text-white"
                                                            : status === "active"
                                                                ? "bg-[#2C2724] text-[#E0C9A6] ring-4 ring-[#FAF8F5]"
                                                                : "bg-[#F3EDE6] text-[#A89F91]"
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span
                                                    className={`text-xs font-semibold ${status === "active" || status === "completed"
                                                            ? "text-[#2C2724]"
                                                            : "text-[#A89F91]"
                                                        }`}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* অর্ডারকৃত আইটেম তালিকা */}
                    <div className="bg-white border border-[#E8E1D9] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[#2C2724] mb-4 pb-3 border-b border-[#E8E1D9]">
                            অর্ডারকৃত প্রোডাক্ট
                        </h3>

                        <div className="divide-y divide-[#F4ECE4]">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
                                    <div className="w-14 h-14 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] overflow-hidden shrink-0">
                                        <img
                                            src={item.image || "/placeholder.jpg"}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-semibold text-[#2C2724] truncate">
                                            {item.title}
                                        </h4>
                                        <p className="text-[11px] text-[#70645C] mt-0.5">
                                            পরিমাণ: {item.quantity} টি | দাম: ৳{item.price?.toLocaleString("bn-BD")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs sm:text-sm font-bold text-[#2C2724]">
                                            ৳{(item.price * item.quantity).toLocaleString("bn-BD")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* হিসাব বিবরণী */}
                        <div className="mt-6 pt-4 border-t border-[#E8E1D9] space-y-2 text-xs text-[#70645C]">
                            <div className="flex justify-between">
                                <span>ডেলিভারি চার্জ:</span>
                                <span>৳{order.shippingCharge?.toLocaleString("bn-BD")}</span>
                            </div>
                            <div className="flex justify-between font-bold text-[#2C2724] text-sm pt-2 border-t border-[#E8E1D9]">
                                <span>সর্বমোট প্রদেয়:</span>
                                <span>৳{order.totalPrice?.toLocaleString("bn-BD")}</span>
                            </div>
                        </div>
                    </div>

                    {/* ডেলিভারি ও কাস্টমার তথ্য */}
                    <div className="bg-white border border-[#E8E1D9] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[#2C2724] mb-4 pb-3 border-b border-[#E8E1D9]">
                            ডেলিভারি সংক্রান্ত তথ্য
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="flex items-start gap-2.5">
                                <User className="w-4 h-4 text-[#9E7B66] shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[#8C7A6B] block">গ্রাহকের নাম</span>
                                    <span className="font-semibold text-[#2C2724]">{order.name}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Phone className="w-4 h-4 text-[#9E7B66] shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[#8C7A6B] block">মোবাইল নম্বর</span>
                                    <span className="font-semibold text-[#2C2724]">{order.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 sm:col-span-2">
                                <MapPin className="w-4 h-4 text-[#9E7B66] shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[#8C7A6B] block">ডেলিভারির ঠিকানা</span>
                                    <span className="font-semibold text-[#2C2724]">{order.address}</span>
                                    <span className="text-[11px] text-[#8C7A6B] block mt-0.5">
                                        (এরিয়া: {order.deliveryLocation === "inside_dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            <Suspense
                fallback={
                    <div className="py-20 flex justify-center items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#9E7B66]" />
                    </div>
                }
            >
                <TrackOrderContent />
            </Suspense>
        </div>
    );
}