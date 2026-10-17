"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { fetchHomeTopReviews } from "@/lib/action/review";

// এর কম রিভিউ থাকলে মার্কি (চলমান স্লাইড) না দেখিয়ে স্থির গ্রিডে দেখানো হয়
const MIN_REVIEWS_FOR_MARQUEE = 3;

const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("bn-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const normalizeReview = (review) => {
    const product = review.productId && typeof review.productId === "object" ? review.productId : null;
    return {
        id: review._id,
        name: review.userName || "গ্রাহক",
        avatar: review.userImage || "",
        date: formatDate(review.createdAt),
        rating: Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0))),
        review: review.comment,
        productName: product?.titleBn || product?.titleEn || "",
        productImage: product?.images?.[0] || null,
        productSlug: product?.slug || null,
    };
};

export default function CustomerReviews() {
    const [isPaused, setIsPaused] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchHomeTopReviews()
            .then((res) => {
                if (cancelled) return;
                setReviews((res?.data || []).map(normalizeReview));
                setStats({
                    averageRating: res?.meta?.averageRating || 0,
                    totalReviews: res?.meta?.totalReviews || 0,
                });
            })
            .catch(() => {
                if (!cancelled) setReviews([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!loading && reviews.length === 0) return null;

    const useMarquee = reviews.length >= MIN_REVIEWS_FOR_MARQUEE;
    const displayReviews = useMarquee ? [...reviews, ...reviews] : reviews;
    const averageStars = Math.round(stats.averageRating);

    return (
        <section className="w-full px-2 sm:px-3 md:px-4 py-14 lg:py-20 bg-[#FAF8F5] overflow-hidden border-t border-[#E8E1D9]">
            {/* Header & Rating Summary */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12 pb-6 border-b border-[#E8E1D9]">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-[1.5px] bg-[#9E7B66]" />
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-[#9E7B66] uppercase">
                            কাস্টমার রিভিউ
                        </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2724] tracking-tight">
                        আমাদের সম্মানিত গ্রাহকদের অভিজ্ঞতা
                    </h2>
                    <p className="text-xs sm:text-sm text-[#70645C] mt-2 max-w-xl leading-relaxed">
                        হাজারো নারীর বিশ্বস্ত সঙ্গী জারা লঞ্চ। প্রতিটি পোশাকে আমরা নিশ্চিত করি প্রিমিয়াম ফেব্রিক, আরাম ও মার্জিত রূপ।
                    </p>
                </div>

                {/* Rating Trust Badges */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-3.5 px-4 py-3 bg-[#FFFFFF] rounded-2xl border border-[#E8E1D9] shadow-2xs">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-serif text-2xl font-bold text-[#2C2724] leading-none">
                                    {stats.averageRating.toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                </span>
                                <div className="flex items-center text-[#E0C9A6]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < averageStars ? "fill-[#E0C9A6]" : ""}`} />
                                    ))}
                                </div>
                            </div>
                            <span className="text-[11px] text-[#8C7A6B] mt-1">
                                {stats.totalReviews.toLocaleString("bn-BD")}টি গ্রাহক রিভিউ
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-3 bg-[#F4ECE4] rounded-2xl border border-[#E3D7CC] shadow-2xs">
                        <ShieldCheck className="w-5 h-5 text-[#9E7B66]" />
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-[#2C2724] leading-tight">
                                ১০০% প্রামাণ্য পণ্য
                            </span>
                            <span className="text-[10px] text-[#8C7A6B]">সন্তুষ্ট গ্রাহক</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex gap-4 sm:gap-6 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-[300px] sm:w-[360px] h-[220px] shrink-0 rounded-2xl bg-[#EFE8DF] animate-pulse" />
                    ))}
                </div>
            ) : (
            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {useMarquee && (
                    <>
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-[#FAF8F5] to-transparent" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-[#FAF8F5] to-transparent" />
                    </>
                )}

                <motion.div
                    className={useMarquee ? "flex gap-4 sm:gap-6 w-max" : "flex flex-wrap justify-center gap-4 sm:gap-6"}
                    animate={useMarquee ? { x: isPaused ? undefined : ["0%", "-50%"] } : undefined}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: Math.max(20, reviews.length * 6),
                            ease: "linear",
                        },
                    }}
                >
                    {displayReviews.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="w-[300px] sm:w-[360px] flex flex-col justify-between p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E1D9] shadow-2xs hover:shadow-md hover:border-[#D4BA91] transition-all duration-300 select-none"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EFE8DF] shrink-0 border border-[#E8E1D9] flex items-center justify-center">
                                            {item.avatar ? (
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-[#9E7B66]">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-bold text-[#2C2724]">
                                            {item.name}
                                        </h3>
                                    </div>

                                    <span className="text-[10px] text-[#A89F91] whitespace-nowrap">
                                        {item.date}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 mt-3.5 text-[#E0C9A6]">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-[#E0C9A6]" />
                                    ))}
                                </div>

                                <p className="mt-3 text-xs sm:text-[13px] text-[#4A423D] leading-relaxed font-light">
                                    “{item.review}”
                                </p>
                            </div>

                            <div className="mt-4 pt-3.5 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
                                <Link
                                    href={item.productSlug ? `/products/${item.productSlug}` : "/products"}
                                    className="flex items-center gap-2 overflow-hidden hover:opacity-80 transition-opacity"
                                >
                                    {item.productImage && (
                                        <div className="relative w-7 h-9 rounded bg-[#FAF8F5] overflow-hidden shrink-0 border border-[#E8E1D9]">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <span className="text-[11px] font-medium text-[#7C6E65] truncate">
                                        {item.productName}
                                    </span>
                                </Link>

                                <span className="text-[10px] font-medium text-[#9E7B66] bg-[#F4ECE4] px-2 py-0.5 rounded-full shrink-0">
                                    গ্রাহক রিভিউ
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            )}
        </section>
    );
}