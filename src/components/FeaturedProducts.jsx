"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import ProductCart from "./ProductCart";
import { fetchAllProducts } from "@/lib/action/products";


export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const getFeaturedProducts = async () => {
            try {
                setLoading(true);

                const response = await fetchAllProducts({ limit: 8, isFeatured: "true" });

                const actualProducts = response?.data || [];

                console.log(actualProducts);

                setProducts(actualProducts);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        getFeaturedProducts();
    }, []);

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

            {/* Product Grid / Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-20 text-[#9E7B66]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <p className="text-center text-[#70645C] py-10">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCart
                            key={product._id}
                            product={product}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}