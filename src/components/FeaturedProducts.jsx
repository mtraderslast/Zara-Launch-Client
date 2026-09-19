"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, ArrowUpRight } from "lucide-react";

// Mock data structured to match the backend Mongoose Product Schema
const sampleProducts = [
    {
        _id: "prod_01",
        titleBn: "দুবাই চেরি সফট সিল্ক আবায়া",
        slug: "dubai-cherry-soft-silk-abaya",
        subCategory: "আবায়া",
        price: 4500,
        discountRate: 15,
        discountedPrice: 3825,
        hasVariants: true,
        images: ["/products/abaya-1.jpg", "/products/abaya-1-alt.jpg"],
        stock: 12,
    },
    {
        _id: "prod_02",
        titleBn: "রয়েল এমব্রয়ডারি ব্ল্যাক বোরকা",
        slug: "royal-embroidery-black-borka",
        subCategory: "বোরকা",
        price: 3800,
        discountRate: 10,
        discountedPrice: 3420,
        hasVariants: true,
        images: ["/products/borka-1.jpg", "/products/borka-1-alt.jpg"],
        stock: 8,
    },
    {
        _id: "prod_03",
        titleBn: "ক্লাসিক কাফতান স্টাইল আবায়া",
        slug: "classic-kaftan-style-abaya",
        subCategory: "আবায়া",
        price: 5200,
        discountRate: 20,
        discountedPrice: 4160,
        hasVariants: true,
        images: ["/products/abaya-2.jpg", "/products/abaya-2-alt.jpg"],
        stock: 5,
    },
    {
        _id: "prod_04",
        titleBn: "মডার্ন জিপার ফ্রন্ট গাউন বোরকা",
        slug: "modern-zipper-front-gown-borka",
        subCategory: "বোরকা",
        price: 3600,
        discountRate: 0,
        discountedPrice: 3600,
        hasVariants: false,
        images: ["/products/borka-2.jpg", "/products/borka-2-alt.jpg"],
        stock: 15,
    },
    {
        _id: "prod_05",
        titleBn: "লাক্সারি পার্ল ওয়ার্ক পার্টি আবায়া",
        slug: "luxury-pearl-work-party-abaya",
        subCategory: "আবায়া",
        price: 6500,
        discountRate: 25,
        discountedPrice: 4875,
        hasVariants: true,
        images: ["/products/abaya-3.jpg", "/products/abaya-3-alt.jpg"],
        stock: 4,
    },
    {
        _id: "prod_06",
        titleBn: "প্রিমিয়াম কোরিয়ান নিদাহ বোরকা সেট",
        slug: "premium-korean-nidah-borka-set",
        subCategory: "বোরকা",
        price: 4900,
        discountRate: 12,
        discountedPrice: 4312,
        hasVariants: true,
        images: ["/products/borka-3.jpg", "/products/borka-3-alt.jpg"],
        stock: 10,
    },
    {
        _id: "prod_07",
        titleBn: "এলিগ্যান্ট প্লেটেড সামার আবায়া",
        slug: "elegant-pleated-summer-abaya",
        subCategory: "আবায়া",
        price: 4200,
        discountRate: 0,
        discountedPrice: 4200,
        hasVariants: false,
        images: ["/products/abaya-4.jpg", "/products/abaya-4-alt.jpg"],
        stock: 9,
    },
    {
        _id: "prod_08",
        titleBn: "মিনিমালিস্ট ক্যাজুয়াল এ-লাইন বোরকা",
        slug: "minimalist-casual-a-line-borka",
        subCategory: "বোরকা",
        price: 3200,
        discountRate: 10,
        discountedPrice: 2880,
        hasVariants: true,
        images: ["/products/borka-4.jpg", "/products/borka-4-alt.jpg"],
        stock: 20,
    },
];

export default function FeaturedProducts({ products = sampleProducts }) {
    const [wishlist, setWishlist] = useState([]);

    const toggleWishlist = (productId) => {
        setWishlist((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <section className="w-full px-2 sm:px-3 md:px-4 py-12 lg:py-16 bg-[#FAF8F5]">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-[#E8E1D9]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-[1.5px] bg-[#9E7B66]" />
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-[#9E7B66] uppercase">
                            ফিচার্ড কালেকশন
                        </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2724] tracking-tight">
                        ট্রেন্ডিং বোরকা ও আবায়া কালেকশন
                    </h2>
                    <p className="text-xs sm:text-sm text-[#70645C] mt-1.5">
                        প্রিমিয়াম ফেব্রিক ও মার্জিত ডিজাইনের নতুন সংকলন
                    </p>
                </div>

                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#2C2724] bg-[#F3ECE4] hover:bg-[#2C2724] hover:text-[#FAF8F5] border border-[#DDD3C7] shadow-xs transition-all duration-300 group"
                >
                    <span>সবগুলো দেখুন</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#9E7B66] group-hover:text-[#FAF8F5] transition-colors" />
                </Link>
            </div>

            {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on XL desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product) => {
                    const isWishlisted = wishlist.includes(product._id);
                    const hasDiscount = product.discountRate > 0;

                    return (
                        <div
                            key={product._id}
                            className="group relative flex flex-col bg-[#FFFFFF] rounded-xl lg:rounded-2xl border border-[#E8E1D9] overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            {/* Product Media Area */}
                            <div className="relative w-full aspect-[3/4] bg-[#F5EFE9] overflow-hidden">
                                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                                    <Image
                                        src={product.images[0] || "/placeholder-product.jpg"}
                                        alt={product.titleBn}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                </Link>

                                {/* Badges: Top Left */}
                                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
                                    {hasDiscount && (
                                        <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider bg-[#2C2724] text-[#E0C9A6] shadow-xs">
                                            {product.discountRate}% ছাড়
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide bg-[#FAF8F5]/90 backdrop-blur-xs text-[#5C534D] border border-[#E8E1D9]">
                                        {product.subCategory}
                                    </span>
                                </div>

                                {/* Wishlist Button: Top Right */}
                                <button
                                    type="button"
                                    onClick={() => toggleWishlist(product._id)}
                                    aria-label="Add to Wishlist"
                                    className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FFFFFF] text-[#2C2724] shadow-xs backdrop-blur-xs transition-colors duration-200"
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-colors ${isWishlisted
                                                ? "fill-[#9E7B66] text-[#9E7B66]"
                                                : "text-[#4A423D] hover:text-[#9E7B66]"
                                            }`}
                                    />
                                </button>

                                {/* Quick View Button: Visible on Desktop Hover */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="hidden md:inline-flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/90 hover:bg-[#2C2724] hover:text-[#FAF8F5] text-[#2C2724] text-xs font-medium tracking-wider backdrop-blur-xs shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>কুইক ভিউ</span>
                                </Link>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
                                <div>
                                    {/* Variants Tag */}
                                    {product.hasVariants && (
                                        <span className="text-[10px] font-medium text-[#8C7A6B] block mb-1">
                                            বিভিন্ন সাইজ এভেলেবল
                                        </span>
                                    )}

                                    {/* Title */}
                                    <Link href={`/products/${product.slug}`}>
                                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#2C2724] line-clamp-1 hover:text-[#9E7B66] transition-colors">
                                            {product.titleBn}
                                        </h3>
                                    </Link>

                                    {/* Pricing Display */}
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="font-serif text-base sm:text-lg font-bold text-[#2C2724]">
                                            ৳{product.discountedPrice.toLocaleString("bn-BD")}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-xs sm:text-sm text-[#A89F91] line-through">
                                                ৳{product.price.toLocaleString("bn-BD")}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Cart Action Button */}
                                <div className="mt-3.5 sm:mt-4 pt-2 border-t border-[#F2ECE4]">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.98] transition-all duration-200 shadow-xs"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5 text-[#E0C9A6]" />
                                        <span>কার্টে রাখুন</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}