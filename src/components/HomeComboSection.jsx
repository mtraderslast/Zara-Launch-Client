"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    Truck,
    PackageCheck,
    Layers,
} from "lucide-react";
import { fetchActiveCombos } from "@/lib/action/combos";

export default function HomeComboSection() {
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const getFeaturedCombo = async () => {
            try {
                setLoading(true);
                const response = await fetchActiveCombos({ limit: 1 });
                const comboList = response?.data || [];
                if (comboList.length > 0) {
                    const featured = comboList[0];
                    setCombo(featured);
                    setSelectedImage(featured.bannerImage || featured.images?.[0] || "");
                }
            } catch (error) {
                console.error("Failed to fetch featured combo:", error);
            } finally {
                setLoading(false);
            }
        };

        getFeaturedCombo();
    }, []);

    if (loading) {
        return (
            <section className="w-full px-3 sm:px-6 lg:px-8 py-12 lg:py-16 bg-[#FAF8F5]">
                <div className="w-full max-w-7xl mx-auto rounded-3xl bg-[#FFFFFF] border border-[#E8E1D9] p-6 sm:p-10 animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="h-6 w-32 bg-[#EFE8DF] rounded-full" />
                            <div className="h-10 w-3/4 bg-[#EFE8DF] rounded-xl" />
                            <div className="h-20 w-full bg-[#EFE8DF] rounded-xl" />
                            <div className="h-12 w-48 bg-[#EFE8DF] rounded-xl" />
                        </div>
                        <div className="lg:col-span-5 aspect-[4/3] bg-[#EFE8DF] rounded-2xl" />
                    </div>
                </div>
            </section>
        );
    }

    if (!combo) return null;

    const discountRate =
        combo.originalPrice > combo.comboPrice
            ? Math.round(((combo.originalPrice - combo.comboPrice) / combo.originalPrice) * 100)
            : 0;

    const savedAmount = Math.max(0, combo.originalPrice - combo.comboPrice);
    const allGalleryImages = [combo.bannerImage, ...(combo.images || [])].filter(Boolean);

    return (
        <section className="w-full px-4 py-12 lg:py-16 bg-[#FAF8F5]">
            <div className="w-full mx-auto">
                {/* হেডার */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E8E1D9]">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-6 h-[1.5px] bg-[#9E7B66]" />
                            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#9E7B66] uppercase">
                                স্পেশাল বান্ডেল
                            </span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2724] tracking-tight">
                            সীমিত সময়ের মেগা কম্বো
                        </h2>
                        <p className="text-xs sm:text-sm text-[#70645C] mt-1.5">
                            একসাথে একাধিক প্রিমিয়াম পণ্য কিনে উপভোগ করুন বিশেষ ছাড়
                        </p>
                    </div>

                    <Link
                        href="/combo"
                        className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#2C2724] bg-[#FFFFFF] hover:bg-[#2C2724] hover:text-[#FAF8F5] border border-[#DDD3C7] shadow-xs transition-all duration-300 group"
                    >
                        <span>সকল কম্বো অফার</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#9E7B66] group-hover:text-[#FAF8F5] transition-colors" />
                    </Link>
                </div>

                {/* লাক্সারি কার্ড কন্টেইনার */}
                <div className="relative w-full rounded-2xl lg:rounded-3xl bg-[#FFFFFF] border border-[#E8E1D9] shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* বাম পাশ: বিস্তারিত বিবরণ */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">

                            {/* ব্যাজ ও স্টক তথ্য */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#F3ECE4] text-[#8C705F] border border-[#E2D6CA]">
                                    <Sparkles className="w-3.5 h-3.5 text-[#9E7B66]" />
                                    এক্সক্লুসিভ কম্বো
                                </span>

                                {discountRate > 0 && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#2C2724] text-[#E0C9A6]">
                                        {discountRate}% নিশ্চিত সাশ্রয়
                                    </span>
                                )}

                                {combo.stock > 0 && (
                                    <span className="text-[11px] font-medium text-[#7C6E65] bg-[#FAF8F5] border border-[#E8E1D9] px-3 py-1 rounded-full">
                                        স্টক বাকি: {combo.stock.toLocaleString("bn-BD")} টি
                                    </span>
                                )}
                            </div>

                            {/* টাইটেল এবং ডেসক্রিপশন */}
                            <div className="space-y-3">
                                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2C2724] leading-snug">
                                    {combo.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#5C534D] leading-relaxed whitespace-pre-line font-light">
                                    {combo.description}
                                </p>
                            </div>

                            {/* বান্ডেল পণ্যের তালিকা */}
                            {combo.products && combo.products.length > 0 && (
                                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#70645C]">
                                        <Layers className="w-3.5 h-3.5 text-[#9E7B66]" />
                                        প্যাকেজে যা যা পাচ্ছেন:
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {combo.products.map((item, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#FFFFFF] border border-[#E8E1D9] text-[#2C2724]"
                                            >
                                                <PackageCheck className="w-3.5 h-3.5 text-[#9E7B66]" />
                                                {item.title} {item.quantity > 1 ? `(${item.quantity}টি)` : ""}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* মূল বৈশিষ্ট্যসমূহ */}
                            {combo.features && combo.features.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {combo.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#4A423D]">
                                            <CheckCircle2 className="w-4 h-4 text-[#9E7B66] shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* প্রাইস বক্স */}
                            <div className="pt-2 border-t border-[#F0EAE1]">
                                <div className="flex flex-wrap items-baseline gap-3">
                                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2724]">
                                        ৳{combo.comboPrice.toLocaleString("bn-BD")}
                                    </span>
                                    {combo.originalPrice > combo.comboPrice && (
                                        <span className="text-base sm:text-lg text-[#A89F91] line-through">
                                            ৳{combo.originalPrice.toLocaleString("bn-BD")}
                                        </span>
                                    )}
                                    {savedAmount > 0 && (
                                        <span className="text-xs font-semibold text-[#8C705F] bg-[#F3ECE4] px-2.5 py-1 rounded-md">
                                            মোট সাশ্রয় ৳{savedAmount.toLocaleString("bn-BD")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* অ্যাকশন বাটন এবং সার্ভিস ট্রাস্ট */}
                            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <Link
                                    href={`/combo/${combo.slug}`}
                                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2C2724] hover:bg-[#3E3733] text-[#FAF8F5] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-sm active:scale-95 text-center"
                                >
                                    <span>কম্বো প্যাকেজটি দেখুন</span>
                                    <ArrowRight className="w-4 h-4 text-[#E0C9A6]" />
                                </Link>

                                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-[#70645C]">
                                    <div className="flex items-center gap-1.5">
                                        <Truck className="w-4 h-4 text-[#9E7B66]" />
                                        <span>দ্রুত ডেলিভারি</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-[#9E7B66]" />
                                        <span>ক্যাশ অন ডেলিভারি</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ডান পাশ: ভিজ্যুয়াল গ্যালারি */}
                        <div className="lg:col-span-5 flex flex-col gap-3">
                            <div className="relative w-full aspect-[4/4] rounded-2xl overflow-hidden border border-[#E8E1D9] bg-[#FAF8F5]">
                                <img
                                    src={selectedImage || "/placeholder-product.jpg"}
                                    alt={combo.title}
                                    className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-xs border border-[#E8E1D9] text-[#2C2724] text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                                    স্পেশাল সেভিং প্যাক
                                </div>
                            </div>

                            {/* থাম্বনেইল প্রিভিউ স্ট্রিপ */}
                            {allGalleryImages.length > 1 && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                    {allGalleryImages.map((img, idx) => {
                                        const isSelected = selectedImage === img;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSelectedImage(img)}
                                                className={`relative w-16 h-16 rounded-xl overflow-hidden border transition-all shrink-0 ${isSelected
                                                        ? "border-[#2C2724] ring-2 ring-[#9E7B66]/30"
                                                        : "border-[#E8E1D9] opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}