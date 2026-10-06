"use client";

import Link from "next/link";
import {
    Sparkles,
    CheckCircle2,
    ArrowRight,
    ShoppingBag,
    Layers,
    ShieldCheck,
    Truck,
} from "lucide-react";

export default function ComboCard({ combo }) {
    const discountRate =
        combo.originalPrice > combo.comboPrice
            ? Math.round(((combo.originalPrice - combo.comboPrice) / combo.originalPrice) * 100)
            : 0;

    const savedAmount = Math.max(0, combo.originalPrice - combo.comboPrice);

    return (
        <div className="group flex flex-col bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E8E1D9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
            {/* মিডিয়া সেকশন */}
            <div className="relative w-full aspect-[4/3] bg-[#F5EFE9] overflow-hidden">
                <Link href={`/combo/${combo.slug}`} className="block w-full h-full">
                    <img
                        src={combo.bannerImage || combo.images?.[0] || "/placeholder-product.jpg"}
                        alt={combo.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </Link>

                {/* ব্যাজসমূহ */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                    {discountRate > 0 && (
                        <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-[#2C2724] text-[#E0C9A6] shadow-sm">
                            {discountRate}% ছাড়
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF8F5]/90 backdrop-blur-xs text-[#5C534D] border border-[#E8E1D9]">
                        <Sparkles className="w-3 h-3 text-[#9E7B66]" />
                        স্পেশাল বান্ডেল
                    </span>
                </div>

                {combo.stock > 0 && combo.stock <= 10 && (
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#A8483B] text-white shadow-xs">
                        মাত্র {combo.stock.toLocaleString("bn-BD")} টি বাকি!
                    </div>
                )}
            </div>

            {/* কার্ড বডি */}
            <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between space-y-4">
                <div className="space-y-3">
                    {/* টাইটেল */}
                    <Link href={`/combo/${combo.slug}`}>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C2724] line-clamp-1 hover:text-[#9E7B66] transition-colors">
                            {combo.title}
                        </h3>
                    </Link>

                    {/* বিবরণ */}
                    <p className="text-xs sm:text-sm text-[#70645C] line-clamp-2 leading-relaxed">
                        {combo.description}
                    </p>

                    {/* বান্ডেল আইটেম প্রিভিউ */}
                    {combo.products && combo.products.length > 0 && (
                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] space-y-1.5">
                            <span className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[#9E7B66]" />
                                প্যাকেজে যা থাকছে:
                            </span>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {combo.products.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[11px] font-medium px-2 py-0.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-[#2C2724]"
                                    >
                                        • {item.title} {item.quantity > 1 ? `(${item.quantity}টি)` : ""}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* মূল ফিচার্স */}
                    {combo.features && combo.features.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                            {combo.features.slice(0, 2).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-[#5C534D]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7B66] shrink-0" />
                                    <span className="line-clamp-1">{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* মূল্য ও অ্যাকশন বাটন */}
                <div className="pt-3 border-t border-[#F2ECE4] space-y-3">
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-xl sm:text-2xl font-bold text-[#2C2724]">
                                ৳{combo.comboPrice.toLocaleString("bn-BD")}
                            </span>
                            {combo.originalPrice > combo.comboPrice && (
                                <span className="text-xs sm:text-sm text-[#A89F91] line-through">
                                    ৳{combo.originalPrice.toLocaleString("bn-BD")}
                                </span>
                            )}
                        </div>
                        {savedAmount > 0 && (
                            <span className="text-[11px] font-bold text-[#8C705F] bg-[#F3ECE4] px-2 py-0.5 rounded-md">
                                সাশ্রয় ৳{savedAmount.toLocaleString("bn-BD")}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={`/combo/${combo.slug}`}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-[#2C2724] bg-[#F3ECE4] hover:bg-[#EFE8DF] border border-[#DDD3C7] transition-all duration-200"
                        >
                            <span>বিস্তারিত</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                            href={`/combo/${combo.slug}`}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.98] transition-all duration-200 shadow-xs"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#E0C9A6]" />
                            <span>অর্ডার করুন</span>
                        </Link>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] pt-1">
                        <span className="inline-flex items-center gap-1">
                            <Truck className="w-3 h-3 text-[#9E7B66]" /> হোম ডেলিভারি
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#9E7B66]" /> ক্যাশ অন ডেলিভারি
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}