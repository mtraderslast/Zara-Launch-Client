import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export default function HomeComboSection() {
    const combo = {
        titleBn: "রয়েল ব্রাইডাল বোরকা ও বিউটি সিগনেচার বান্ডেল",
        subtitle:
            "প্রিমিয়াম চেরি সিল্ক বোরকা, খাঁটি উদ বডি স্প্রে এবং গ্লো সিরাম একসাথে",
        slug: "royal-bridal-bundle",
        originalPrice: 8500,
        discountedPrice: 5990,
        discountRate: 30,
        badge: "লিমিটেড স্টক অফার",
        image:"/combo-img-2.png",
        stockLeft: 7,
    };

    return (
        <section className="w-full px-2 sm:px-3 md:px-4 py-12 lg:py-16 bg-[#FAF8F5]">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-[#e2d1be]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-[1.5px] bg-[#9E7B66]" />
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-[#9E7B66] uppercase">
                            স্পেশাল প্যাকেজ
                        </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2724] tracking-tight">
                        কম্পো অফার
                    </h2>
                    <p className="text-xs sm:text-sm text-[#70645C] mt-1.5">
                        সেরা পছন্দের প্যাকেজগুলোতে উপভোগ করুন বিশেষ মূল্যছাড়
                    </p>
                </div>

                <Link
                    href="/combos"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#2C2724] bg-[#F3ECE4] hover:bg-[#2C2724] hover:text-[#FAF8F5] border border-[#DDD3C7] shadow-xs transition-all duration-300 group"
                >
                    <span>সব কম্বো অফার দেখুন</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#9E7B66] group-hover:text-[#FAF8F5] transition-colors" />
                </Link>
            </div>

            {/* Soft Themed Combo Feature Card */}
            <div className="relative w-full rounded-2xl lg:rounded-3xl bg-[#e2d1be] border border-[#E8E1D9] shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F4ECE4] text-[#8C705F] border border-[#E2D6CA]">
                                <Sparkles className="w-3.5 h-3.5 text-[#9E7B66]" />
                                {combo.badge}
                            </span>
                            <span className="text-xs font-medium text-[#7C6E65] bg-[#FAF8F5] border border-[#E8E1D9] px-2.5 py-1 rounded-full">
                                মাত্র {combo.stockLeft} টি বান্ডেল বাকি
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2C2724] leading-tight">
                                {combo.titleBn}
                            </h3>
                            <p className="text-sm sm:text-base text-[#5C534D] font-light leading-relaxed max-w-xl">
                                {combo.subtitle}
                            </p>
                        </div>

                        {/* Price Box */}
                        <div className="flex items-baseline gap-4 pt-1">
                            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2724]">
                                ৳{combo.discountedPrice.toLocaleString("bn-BD")}
                            </span>
                            <span className="text-base sm:text-lg text-[#A89F91] line-through">
                                ৳{combo.originalPrice.toLocaleString("bn-BD")}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#EFE8DF] text-[#7C6353] border border-[#D9CEBF]">
                                {combo.discountRate}% সেভ
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <Link
                                href={`/combos/${combo.slug}`}
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2C2724] hover:bg-[#3E3733] text-[#FAF8F5] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-sm active:scale-95"
                            >
                                <span>কম্বো প্যাকেজটি দেখুন</span>
                                <ArrowRight className="w-4 h-4 text-[#E0C9A6]" />
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-[#70645C]">
                                <ShieldCheck className="w-4 h-4 text-[#9E7B66]" />
                                <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Image */}
                    <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-2xl overflow-hidden border border-[#E8E1D9] bg-[#F5EFE9]">
                        <img
                            src={combo.image}
                            alt={combo.titleBn}
                            className="object-cover object-center hover:scale-105 transition-transform duration-700 h-full"
                        />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#E8E1D9] text-xs">
                            <span className="text-[#2C2724] font-medium">৩টি প্রিমিয়াম আইটেমের কম্বো</span>
                            <span className="text-[#9E7B66] font-bold">ফ্রি ডেলিভারি</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}