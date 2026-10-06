"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    CheckCircle2,
    ShieldCheck,
    Truck,
    RefreshCw,
    PackageCheck,
    Play,
    PhoneCall,
    MapPin,
    Loader2,
    User,
    Lock,
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchComboBySlug } from "@/lib/action/combos";
import { createOrder } from "@/lib/action/order";

function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    try {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11
            ? `https://www.youtube.com/embed/${match[2]}`
            : null;
    } catch {
        return null;
    }
}

export default function ComboDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug;

    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [deliveryArea, setDeliveryArea] = useState("inside_dhaka");
    const [orderSubmitting, setOrderSubmitting] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const loadComboData = async () => {
            try {
                setLoading(true);
                const response = await fetchComboBySlug(slug);
                const comboData = response?.data?.data || response?.data;
                if (comboData) {
                    setCombo(comboData);
                    setActiveImage(comboData.bannerImage || comboData.images?.[0] || "");
                }
            } catch (error) {
                console.error("Failed to load combo details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadComboData();
    }, [slug]);

    const allImages = useMemo(() => {
        if (!combo) return [];
        return [combo.bannerImage, ...(combo.images || [])].filter(Boolean);
    }, [combo]);

    const discountRate = useMemo(() => {
        if (!combo || !combo.originalPrice || combo.originalPrice <= combo.comboPrice) return 0;
        return Math.round(((combo.originalPrice - combo.comboPrice) / combo.originalPrice) * 100);
    }, [combo]);

    const unitSavings = useMemo(() => {
        if (!combo || !combo.originalPrice || combo.originalPrice <= combo.comboPrice) return 0;
        return combo.originalPrice - combo.comboPrice;
    }, [combo]);

    const totalSavings = unitSavings * quantity;
    const deliveryCharge = deliveryArea === "inside_dhaka" ? 70 : 130;
    const subTotal = (combo?.comboPrice || 0) * quantity;
    const grandTotal = subTotal + deliveryCharge;

    const handleDirectOrder = async (e) => {
        e.preventDefault();

        if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
            Swal.fire({
                icon: "warning",
                title: "অসম্পূর্ণ তথ্য",
                text: "অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করুন।",
                confirmButtonColor: "#2C2724",
            });
            return;
        }

        const bdPhoneRegex = /(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/;
        if (!bdPhoneRegex.test(customerPhone.trim())) {
            Swal.fire({
                icon: "warning",
                title: "সঠিক মোবাইল নম্বর দিন",
                text: "১১ ডিজিটের সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017xxxxxxxx)।",
                confirmButtonColor: "#2C2724",
            });
            return;
        }

        setOrderSubmitting(true);

        try {
            const orderPayload = {
                orderType: "combo",
                name: customerName.trim(),
                phone: customerPhone.trim(),
                address: customerAddress.trim(),
                deliveryLocation: deliveryArea,
                items: [
                    {
                        slug: combo.slug || slug,
                        quantity: Number(quantity),
                        variantSku: null,
                    },
                ],
            };

            const response = await createOrder(orderPayload);
            const createdOrder = response?.data?.data || response?.data;

            setCustomerName("");
            setCustomerPhone("");
            setCustomerAddress("");

            const trackingId = createdOrder?.trackingId;
            router.push(`/order-success?trackingId=${trackingId}`);
        } catch (error) {
            console.error("Combo order failed:", error);
            const errorMsg = error?.response?.data?.message || error?.message || "অর্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
            Swal.fire({
                icon: "error",
                title: "ব্যর্থ হয়েছে",
                text: errorMsg,
                confirmButtonColor: "#A8483B",
            });
        } finally {
            setOrderSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center py-20 px-4 space-y-3">
                <Loader2 className="w-8 h-8 text-[#9E7B66] animate-spin" />
                <p className="text-xs text-[#70645C]">লোড হচ্ছে...</p>
            </div>
        );
    }

    if (!combo) {
        return (
            <div className="w-full min-h-screen bg-[#FAF8F5] flex items-center justify-center py-20 px-4 text-center">
                <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#E8E1D9] max-w-sm w-full space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#2C2724]">প্যাকেজটি পাওয়া যায়নি</h2>
                    <p className="text-xs text-[#70645C]">লিংকটি ভুল অথবা প্যাকেজটি সক্রিয় নেই।</p>
                </div>
            </div>
        );
    }

    const embedVideoUrl = getYouTubeEmbedUrl(combo.videoUrl);

    return (
        <div className="w-full min-h-screen bg-[#FAF8F5] text-[#2C2724]">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
                    {/* বাম পাশ: ইমেজ গ্যালারি ও ভিডিও */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E1D9] shadow-xs space-y-4">
                            <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E8E1D9] group cursor-zoom-in">
                                <img
                                    src={activeImage || "/placeholder-product.jpg"}
                                    alt={combo.title}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115"
                                />

                                {discountRate > 0 && (
                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-[#2C2724] text-[#E0C9A6] shadow-sm">
                                        {discountRate}% ছাড়
                                    </span>
                                )}
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
                                    {allImages.map((img, idx) => {
                                        const isSelected = activeImage === img;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveImage(img)}
                                                className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-lg overflow-hidden border shrink-0 transition-all ${isSelected
                                                    ? "border-[#2C2724] ring-1 ring-[#9E7B66]"
                                                    : "border-[#E8E1D9] opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {embedVideoUrl && (
                            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E1D9] shadow-xs space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#E8E1D9] text-xs font-semibold text-[#2C2724]">
                                    <Play className="w-4 h-4 text-[#9E7B66]" />
                                    <span>ভিডিও উপস্থাপনা</span>
                                </div>
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#E8E1D9] bg-black">
                                    <iframe
                                        src={embedVideoUrl}
                                        title={combo.title}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ডান পাশ: প্রোডাক্ট বিবরণ, বান্ডেল আইটেম, প্রাইস ও অর্ডার ফর্ম */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E8E1D9] shadow-xs space-y-5">
                            <div>
                                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2724] leading-snug">
                                    {combo.title}
                                </h1>
                                <p className="text-xs sm:text-sm text-[#70645C] leading-relaxed whitespace-pre-line mt-2 font-light">
                                    {combo.description}
                                </p>
                            </div>

                            {/* প্রাইস বক্স */}
                            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] space-y-1.5">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2724]">
                                        ৳{combo.comboPrice?.toLocaleString("bn-BD")}
                                    </span>
                                    {combo.originalPrice > combo.comboPrice && (
                                        <span className="text-sm sm:text-base text-[#A89F91] line-through">
                                            ৳{combo.originalPrice?.toLocaleString("bn-BD")}
                                        </span>
                                    )}
                                    {discountRate > 0 && (
                                        <span className="text-xs font-bold text-[#9E7B66] bg-[#FFFFFF] border border-[#E8E1D9] px-2 py-0.5 rounded">
                                            {discountRate}% ছাড়
                                        </span>
                                    )}
                                </div>
                                {totalSavings > 0 && (
                                    <p className="font-medium text-sm text-[#70645C]">
                                        মোট সাশ্রয়: ৳{totalSavings.toLocaleString("bn-BD")}
                                    </p>
                                )}
                            </div>

                            {/* প্যাকেজে অন্তর্ভুক্ত পণ্যসমূহ */}
                            {combo.products && combo.products.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#70645C] flex items-center gap-1.5">
                                        <PackageCheck className="w-4 h-4 text-[#9E7B66]" />
                                        প্যাকেজে যা যা রয়েছে ({combo.products.length} টি আইটেম)
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {combo.products.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9]"
                                            >
                                                <div className="w-12 h-12 rounded-md bg-[#FFFFFF] border border-[#E8E1D9] overflow-hidden shrink-0">
                                                    <img
                                                        src={item.image || "/placeholder-product.jpg"}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-[#2C2724] truncate">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-[11px] text-[#8C7A6B]">
                                                        পরিমাণ: {item.quantity} টি
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ফিচার্স */}
                            {combo.features && combo.features.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-[#E8E1D9]">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {combo.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-[#5C534D]">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7B66] shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* পরিমাণ বাড়ানো/কমানো */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#E8E1D9]">
                                <span className="text-xs font-semibold text-[#70645C]">প্যাকেজ সংখ্যা (Quantity):</span>
                                <div className="flex items-center border border-[#E8E1D9] rounded-lg overflow-hidden bg-[#FAF8F5]">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#2C2724] hover:bg-[#EFE8DF] transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-9 text-center text-xs font-bold text-[#2C2724]">
                                        {quantity.toLocaleString("bn-BD")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#2C2724] hover:bg-[#EFE8DF] transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* সরাসরি অর্ডার ফরম (ক্যাশ অন ডেলিভারি) */}
                        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#2C2724] shadow-sm space-y-5">
                            <div className="pb-3 border-b border-[#E8E1D9]">
                                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C2724]">
                                    অর্ডার ফর্ম (ক্যাশ অন ডেলিভারি)
                                </h3>
                                <p className="text-[11px] text-[#70645C] mt-0.5">
                                    পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
                                </p>
                            </div>

                            <form onSubmit={handleDirectOrder} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#2C2724] mb-1">
                                        আপনার নাম *
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="সম্পূর্ণ নাম লিখুন"
                                            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-xs sm:text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#2C2724] mb-1">
                                        মোবাইল নম্বর *
                                    </label>
                                    <div className="relative">
                                        <PhoneCall className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="১১ ডিজিটের মোবাইল নম্বর"
                                            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-xs sm:text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#2C2724] mb-1">
                                        সম্পূর্ণ ডেলিভারি ঠিকানা *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-2.5" />
                                        <textarea
                                            rows={2}
                                            required
                                            value={customerAddress}
                                            onChange={(e) => setCustomerAddress(e.target.value)}
                                            placeholder="ঠিকানা (বাসা নং, রোড, থানা ও জেলা)"
                                            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-xs sm:text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#2C2724] mb-1">
                                        ডেলিভারি এরিয়া *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <label
                                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${deliveryArea === "inside_dhaka"
                                                ? "bg-[#FAF8F5] border-[#2C2724] font-semibold text-[#2C2724]"
                                                : "bg-[#FFFFFF] border-[#E8E1D9] text-[#70645C]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="radio"
                                                    name="deliveryArea"
                                                    value="inside_dhaka"
                                                    checked={deliveryArea === "inside_dhaka"}
                                                    onChange={(e) => setDeliveryArea(e.target.value)}
                                                    className="accent-[#2C2724]"
                                                />
                                                <span>ঢাকার ভিতরে</span>
                                            </div>
                                            <span>৳৭০</span>
                                        </label>

                                        <label
                                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${deliveryArea === "outside_dhaka"
                                                ? "bg-[#FAF8F5] border-[#2C2724] font-semibold text-[#2C2724]"
                                                : "bg-[#FFFFFF] border-[#E8E1D9] text-[#70645C]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="radio"
                                                    name="deliveryArea"
                                                    value="outside_dhaka"
                                                    checked={deliveryArea === "outside_dhaka"}
                                                    onChange={(e) => setDeliveryArea(e.target.value)}
                                                    className="accent-[#2C2724]"
                                                />
                                                <span>ঢাকার বাইরে</span>
                                            </div>
                                            <span>৳১৩০</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] space-y-1 text-xs">
                                    <div className="flex justify-between text-[#70645C]">
                                        <span>প্যাকেজ মূল্য ({quantity}টি):</span>
                                        <span>৳{subTotal.toLocaleString("bn-BD")}</span>
                                    </div>
                                    <div className="flex justify-between text-[#70645C]">
                                        <span>ডেলিভারি চার্জ:</span>
                                        <span>৳{deliveryCharge.toLocaleString("bn-BD")}</span>
                                    </div>
                                    <div className="flex justify-between text-[#2C2724] font-bold pt-1.5 border-t border-[#E8E1D9] text-sm">
                                        <span>সর্বমোট প্রদেয়:</span>
                                        <span>৳{grandTotal.toLocaleString("bn-BD")}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={orderSubmitting}
                                    className="w-full py-3.5 px-5 rounded-lg bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.99] text-[#FAF8F5] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {orderSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-[#E0C9A6]" />
                                            <span>অর্ডার প্রসেস হচ্ছে...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 text-[#E0C9A6]" />
                                            <span>অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString("bn-BD")})</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* সার্ভিস পলিসি */}
                        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D9] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#70645C]">
                            <div className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-[#9E7B66] shrink-0" />
                                <span>দ্রুত হোম ডেলিভারি</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#9E7B66] shrink-0" />
                                <span>দেখে নেওয়ার সুবিধা</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 text-[#9E7B66] shrink-0" />
                                <span>সহজ রিটার্ন পলিসি</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}