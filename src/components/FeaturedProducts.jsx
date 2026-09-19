"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, ArrowUpRight } from "lucide-react";
import ProductCart from "./ProductCart";

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
        images: ["/product-img-1.png", "/product-img-2.png"],
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
        images: ["/product-img-3.png", "/product-img-4.png"],
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
        images: ["/product-img-5.png", "/product-img-6.png"],
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
        images: ["/product-img-7.png", "/product-img-5.png"],
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
        images: ["/product-img-1.png", "/product-img-2.png"],
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
        images: ["/product-img-3.png", "/product-img-4.png"],
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
        images: ["/product-img-5.png", "/product-img-6.png"],
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
        images: ["/product-img-7.png", "/product-img-5.png"],
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
                {products.map((product) => (
                    <ProductCart key={product._id} product={product} toggleWishlist={toggleWishlist} wishlist={wishlist} />
                ))}
            </div>
        </section>
    );
}