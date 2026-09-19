"use client";

import { useState } from "react";
import { Star, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
    {
        id: 1,
        name: "নুসরাত জাহান",
        location: "ধানমন্ডি, ঢাকা",
        date: "১২ সেপ্টেম্বর, ২০২৬",
        rating: 5,
        verified: true,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        productImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80",
        productName: "দুবাই চেরি সফট সিল্ক আবায়া",
        review:
            "কাপড়ের মান সত্যিই অসাধারণ! একদম ছবির মতোই সুন্দর ফিনিশিং এবং সিলুয়েট। বিশেষ করে সেলাইয়ের সূক্ষ্ম কাজটা আমার খুব মনে ধরেছে। ডেলিভারিও পেয়েছি মাত্র ২ দিনে।",
    },
    {
        id: 2,
        name: "ফারহানা রহমান",
        location: "নাসিরাবাদ, চট্টগ্রাম",
        date: "০৫ সেপ্টেম্বর, ২০২৬",
        rating: 5,
        verified: true,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        productImage: null,
        productName: "রয়্যাল কাফতান পার্টি আবায়া",
        review:
            "আগে অনলাইন থেকে বোরকা নিতে ভয় পেতাম সাইজ আর ফেব্রিক নিয়ে। কিন্তু জারা লঞ্চ থেকে নিয়ে পুরোপুরি সন্তুষ্ট। প্রিমিয়াম প্যাকিং এবং সাথে ম্যাচিং পারফিউম স্যাম্পল উপহার ছিল চমৎকার সারপ্রাইজ!",
    },
    {
        id: 3,
        name: "তানজিলা আক্তার",
        location: "উত্তরা, ঢাকা",
        date: "২৮ আগস্ট, ২০২৬",
        rating: 5,
        verified: true,
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        productImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=80",
        productName: "রোজ ভেলভেট বডি স্প্রে ও উদ",
        review:
            "বডি স্প্রেটার সুবাস দীর্ঘস্থায়ী এবং মিষ্টি একটি আভা ছড়ায়। অ্যালকোহল মুক্ত হওয়ায় স্বাচ্ছন্দ্যে পরা যায়। দ্বিতীয়বারের মতো অর্ডার করলাম।",
    },
    {
        id: 4,
        name: "মেহরিন শায়লা",
        location: "উপশহর, সিলেট",
        date: "২০ আগস্ট, ২০২৬",
        rating: 5,
        verified: true,
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        productImage: null,
        productName: "কোরিয়ান নিদাহ এ-লাইন বোরকা",
        review:
            "গরমের দিনে পরার জন্য এর চেয়ে আরামদায়ক ফেব্রিক আর হয় না। হালকা ও ব্রিদেবল। কাস্টমার কেয়ারের ব্যবহারও অনেক অমায়িক ছিল।",
    },
    {
        id: 5,
        name: "আফসানা হক",
        location: "সোনাডাঙ্গা, খুলনা",
        date: "১০ আগস্ট, ২০২৬",
        rating: 5,
        verified: true,
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80",
        productImage: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=300&auto=format&fit=crop&q=80",
        productName: "পার্ল ওয়ার্ক পার্টি হিজাব সেট",
        review:
            "পার্লের কাজগুলো খুব মজবুতভাবে বসানো। ওয়াশ করার পরও ফেব্রিক নষ্ট হয়নি। মার্জিত ও রাজকীয় লুক এনে দেয় এক নিমিষেই।",
    },
    {
        id: 6,
        name: "সাদিয়া ইসলাম",
        location: "রাজপাড়া, রাজশাহী",
        date: "০২ আগস্ট, ২০২৬",
        rating: 5,
        verified: true,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        productImage: null,
        productName: "মডার্ন ফ্রন্ট জিপার বোরকা",
        review:
            "অফিস এবং নিয়মিত যাতায়াতের জন্য খুবই ব্যবহারবান্ধব। সাইজিং চার্ট একদম একুরেট ছিল। সবার প্রশংসা পেয়েছি এটি পরে।",
    },
];

export default function CustomerReviews() {
    const [isPaused, setIsPaused] = useState(false);

    const marqueeReviews = [...reviews, ...reviews];

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
                                    ৪.৯
                                </span>
                                <div className="flex items-center text-[#E0C9A6]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-[#E0C9A6]" />
                                    ))}
                                </div>
                            </div>
                            <span className="text-[11px] text-[#8C7A6B] mt-1">
                                ১,২০০+ ভেরিফায়েড রিভিউ
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

            {/* Marquee Carousel Container */}
            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Soft edge fade masks */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-[#FAF8F5] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-[#FAF8F5] to-transparent" />

                {/* Framer Motion Infinite Track */}
                <motion.div
                    className="flex gap-4 sm:gap-6 w-max cursor-grab active:cursor-grabbing"
                    animate={{
                        x: isPaused ? undefined : ["0%", "-50%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 38,
                            ease: "linear",
                        },
                    }}
                >
                    {marqueeReviews.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="w-[300px] sm:w-[360px] flex flex-col justify-between p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E1D9] shadow-2xs hover:shadow-md hover:border-[#D4BA91] transition-all duration-300 select-none"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EFE8DF] shrink-0 border border-[#E8E1D9]">
                                            <img
                                                src={item.avatar}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="text-sm font-bold text-[#2C2724]">
                                                    {item.name}
                                                </h3>
                                                {item.verified && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7B66]" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#8C7A6B]">
                                                {item.location}
                                            </p>
                                        </div>
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
                                <div className="flex items-center gap-2 overflow-hidden">
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
                                </div>

                                <span className="text-[10px] font-medium text-[#9E7B66] bg-[#F4ECE4] px-2 py-0.5 rounded-full shrink-0">
                                    ভেরিফায়েড ক্রেতা
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}