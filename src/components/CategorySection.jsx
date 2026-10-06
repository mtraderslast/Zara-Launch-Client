import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const categories = [
    {
        id: 1,
        title: "প্রিমিয়াম বোরকা",
        subtitle: "ক্লাসিক ও ফরমাল সিলুয়েট",
        itemCount: "২৫+ আইটেম",
        image: "/categories/borka.jpg",
        href: "/products/burka",
    },
    {
        id: 2,
        title: "এক্সক্লুসিভ আবায়া",
        subtitle: "দুবাই ফেব্রিক ও এমব্রয়ডারি",
        itemCount: "১৮+ আইটেম",
        image: "/categories/abaya.jpg",
        href: "/products/abaya",
    },
    {
        id: 3,
        title: "ট্রেন্ডি হিজাব ও স্কার্ফ",
        subtitle: "জর্জেট, শিফন ও সিল্ক",
        itemCount: "৩৫+ আইটেম",
        image: "/categories/hijab.jpg",
        href: "/products/hijab",
    },
    {
        id: 4,
        title: "বডি স্প্রে ও পারফিউম",
        subtitle: "অ্যালকোহল-ফ্রি খাঁটি সুবাস",
        itemCount: "১২+ আইটেম",
        image: "/categories/perfume.jpg",
        href: "/products/body-spray",
    },
    {
        id: 5,
        title: "ফ্যাশন এক্সেসরিজ",
        subtitle: "ব্যাগ, পিন ও ব্রোচ",
        itemCount: "২০+ আইটেম",
        image: "/categories/accessories.jpg",
        href: "/products/accessories",
    },
    {
        id: 6,
        title: "নিউ অ্যারাইভাল",
        subtitle: "সিজন স্পেশাল ডিজাইন",
        itemCount: "১৫+ আইটেম",
        image: "/categories/new-arrivals.jpg",
        href: "/products/new-arrivals",
    },
];

export default function CategorySection() {
    return (
        <section className="w-full px-2 sm:px-3 md:px-4 py-12 lg:py-16 bg-[#FAF8F5]">
            {/* Header Container */}
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
                        আপনার পছন্দের সেরা ও মার্জিত পোশাকটি বেছে নিন
                    </p>
                </div>

                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#2C2724] bg-[#F3ECE4] hover:bg-[#2C2724] hover:text-[#FAF8F5] border border-[#DDD3C7] shadow-xs transition-all duration-300 group"
                >
                    <span>আরও দেখুন</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#9E7B66] group-hover:text-[#FAF8F5] transition-colors" />
                </Link>
            </div>

            {/* Categories Grid (1 col mobile, 2 cols tablet, 3 cols desktop, 6 cols XL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={cat.href}
                        className="group relative h-[380px] sm:h-[400px] xl:h-[420px] rounded-xl lg:rounded-2xl overflow-hidden border border-[#E8E1D9] bg-[#EFE8DF] shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-4 sm:p-5"
                    >
                        {/* Category Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Luxury Gradient Tint */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#201C1A]/95 via-[#201C1A]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                        </div>

                        {/* Bottom Content Card */}
                        <div className="relative z-10 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF8F5]/20 backdrop-blur-sm text-[10px] font-medium tracking-wider text-[#E0C9A6] border border-[#E0C9A6]/30">
                                {cat.itemCount}
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