"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetchCategorySummary } from "@/lib/action/products";
import { getCategory, productsHref } from "@/lib/categories";

const CARD_WIDTH =
    "w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2rem)/3)] xl:w-[calc((100%-3rem)/4)]";

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchCategorySummary()
            .then((res) => {
                if (cancelled) return;
                const items = (res?.data || [])
                    .map((item) => {
                        const config = getCategory(item.category);
                        if (!config) return null;
                        return {
                            value: config.value,
                            title: config.labelBn,
                            titleEn: config.labelEn,
                            subtitle: config.subCategories.map((s) => s.labelBn).join(", "),
                            productCount: item.productCount,
                            image: item.image || null,
                        };
                    })
                    .filter(Boolean);
                setCategories(items);
            })
            .catch(() => {
                if (!cancelled) setCategories([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!loading && categories.length === 0) return null;

    return (
        <section className="w-full px-2 sm:px-3 md:px-4 py-12 lg:py-16 bg-[#FAF8F5]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-[#E8E1D9]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-[1.5px] bg-[#9E7B66]" />
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-[#9E7B66] uppercase">
                            ক্যাটাগরি সমূহ
                        </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2724] tracking-tight">
                        জনপ্রিয় কালেকশন
                    </h2>
                    <p className="text-xs sm:text-sm text-[#70645C] mt-1.5">
                        আপনার পছন্দের ক্যাটাগরি বেছে নিন
                    </p>
                </div>

                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#2C2724] bg-[#F3ECE4] hover:bg-[#2C2724] hover:text-[#FAF8F5] border border-[#DDD3C7] shadow-xs transition-all duration-300 group"
                >
                    <span>সব পণ্য দেখুন</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#9E7B66] group-hover:text-[#FAF8F5] transition-colors" />
                </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {loading
                    ? [...Array(4)].map((_, i) => (
                          <div
                              key={i}
                              className={`${CARD_WIDTH} h-[260px] sm:h-[320px] rounded-xl lg:rounded-2xl bg-[#EFE8DF] animate-pulse`}
                          />
                      ))
                    : categories.map((cat) => (
                          <Link
                              key={cat.value}
                              href={productsHref(cat.value)}
                              className={`${CARD_WIDTH} group relative h-[260px] sm:h-[320px] rounded-xl lg:rounded-2xl overflow-hidden border border-[#E8E1D9] bg-[#EFE8DF] shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-4 sm:p-5`}
                          >
                              <div className="absolute inset-0 z-0">
                                  {cat.image ? (
                                      <img
                                          src={cat.image}
                                          alt={cat.title}
                                          loading="lazy"
                                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                                      />
                                  ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-[#D9CEBF] to-[#9E7B66]" />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#201C1A]/95 via-[#201C1A]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                              </div>

                              <div className="relative z-10 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF8F5]/20 backdrop-blur-sm text-[10px] font-medium tracking-wider text-[#E0C9A6] border border-[#E0C9A6]/30">
                                      {cat.productCount.toLocaleString("bn-BD")}টি পণ্য
                                  </span>

                                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF8F5] leading-snug tracking-wide group-hover:text-[#E0C9A6] transition-colors">
                                      {cat.title}
                                  </h3>

                                  <p className="text-xs text-[#D9CEBF] font-light line-clamp-1">
                                      {cat.subtitle}
                                  </p>

                                  <div className="pt-2 flex items-center justify-between border-t border-[#FAF8F5]/15 opacity-80 group-hover:opacity-100 transition-opacity">
                                      <span className="text-[11px] font-medium tracking-wider uppercase text-[#FAF8F5]">
                                          এক্সপ্লোর করুন
                                      </span>
                                      <span className="w-6 h-6 rounded-full bg-[#FAF8F5]/15 group-hover:bg-[#E0C9A6] text-[#FAF8F5] group-hover:text-[#2C2724] flex items-center justify-center transition-all duration-300">
                                          <ArrowUpRight className="w-3.5 h-3.5" />
                                      </span>
                                  </div>
                              </div>
                          </Link>
                      ))}
            </div>
        </section>
    );
}
