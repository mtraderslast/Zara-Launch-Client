"use client";

import { useState, useEffect } from "react";
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import Link from "next/link";
import Swal from "sweetalert2";
import { useCartStore } from "@/lib/store/useCartStore";
import { toggleFavorite, checkIsFavorite } from "@/lib/action/favorite"; // checkIsFavorite ইমপোর্ট করা হয়েছে
import { authClient } from "@/lib/auth-client";

function ProductCart({ product, wishlist = [] }) {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const addToCart = useCartStore((state) => state.addToCart);

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (wishlist && Array.isArray(wishlist) && product?._id) {
            setIsWishlisted(wishlist.includes(product._id));
        }
    }, [wishlist, product?._id]);

    useEffect(() => {
        let isMounted = true;

        const verifyFavoriteStatus = async () => {
            if (!user || !product?._id) return;

            try {
                const response = await checkIsFavorite(product._id);
                // ব্যাকএন্ডের response.data.isFavorite থেকে মান নেওয়া হচ্ছে
                if (isMounted && response?.success && response?.data?.isFavorite !== undefined) {
                    setIsWishlisted(response.data.isFavorite);
                }
            } catch (error) {
                console.error("Favorite status check failed:", error);
            }
        };

        verifyFavoriteStatus();

        return () => {
            isMounted = false;
        };
    }, [user, product?._id]);

    const discountRate = product?.discountRate || 0;
    const hasDiscount = discountRate > 0;

    const calculatedDiscountedPrice = hasDiscount
        ? Math.round(product.price - (product.price * discountRate) / 100)
        : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.slug, 1, {});
    };

    // ৩. ফেভারিট টগল হ্যান্ডলার
    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // ইউজার লগইন না থাকলে ওয়ার্নিং
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "লগইন প্রয়োজন",
                text: "প্রোডাক্টটি ফেভারিট লিস্টে যোগ করতে অনুগ্রহ করে লগইন করুন।",
                confirmButtonColor: "#2C2724",
                confirmButtonText: "ঠিক আছে",
            });
            return;
        }

        if (isLoading) return;

        // Optimistic UI Update: আগেই আইকন রেসপন্স করানো
        const previousState = isWishlisted;
        setIsWishlisted(!previousState);
        setIsLoading(true);

        try {
            const response = await toggleFavorite(product._id);

            if (response?.success) {
                const finalStatus = response?.isFavorite !== undefined ? response.isFavorite : !previousState;
                setIsWishlisted(finalStatus);

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: response.message || (finalStatus ? "ফেভারিটে যোগ করা হয়েছে" : "ফেভারিট থেকে সরানো হয়েছে"),
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            } else {
                setIsWishlisted(previousState);
            }
        } catch (error) {
            setIsWishlisted(previousState);
            Swal.fire({
                icon: "error",
                title: "ব্যর্থ হয়েছে",
                text: error?.response?.data?.message || "কিছু একটা সমস্যা হয়েছে! পুনরায় চেষ্টা করুন।",
                confirmButtonColor: "#2C2724",
                confirmButtonText: "ঠিক আছে",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative flex flex-col bg-[#FFFFFF] rounded-xl lg:rounded-2xl border border-[#E8E1D9] overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative w-full aspect-[3/4] bg-[#F5EFE9] overflow-hidden">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img
                        src={product.images?.[0] || "/placeholder-product.jpg"}
                        alt={product.titleBn || product.titleEn}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </Link>

                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
                    {hasDiscount && (
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider bg-[#2C2724] text-[#E0C9A6] shadow-xs">
                            {discountRate}% ছাড়
                        </span>
                    )}
                    {product.subCategory && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide bg-[#FAF8F5]/90 backdrop-blur-xs text-[#5C534D] border border-[#E8E1D9]">
                            {product.subCategory}
                        </span>
                    )}
                </div>

                {/* ফেভারিট বাটন */}
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleToggleFavorite}
                    aria-label="Add to Wishlist"
                    className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FFFFFF] text-[#2C2724] shadow-xs backdrop-blur-xs transition-colors duration-200 disabled:opacity-50"
                >
                    <Heart
                        className={`w-4 h-4 transition-all duration-300 ${isWishlisted
                                ? "fill-[#ec0e0e] text-[#df8439e0] scale-110"
                                : "text-[#4A423D] hover:text-[#9E7B66]"
                            }`}
                    />
                </button>

                <Link
                    href={`/products/${product.slug}`}
                    className="hidden md:inline-flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/90 hover:bg-[#2C2724] hover:text-[#FAF8F5] text-[#2C2724] text-xs font-medium tracking-wider backdrop-blur-xs shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    <Eye className="w-3.5 h-3.5" />
                    <span>কুইক ভিউ</span>
                </Link>
            </div>

            <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
                <div>
                    {product.hasVariants && (
                        <span className="text-[10px] font-medium text-[#8C7A6B] block mb-1">
                            বিভিন্ন সাইজ এভেলেবল
                        </span>
                    )}

                    <Link href={`/products/${product.slug}`}>
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#2C2724] line-clamp-1 hover:text-[#9E7B66] transition-colors">
                            {product.titleBn}
                        </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#2C2724]">
                            ৳{calculatedDiscountedPrice.toLocaleString("bn-BD")}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs sm:text-sm text-[#A89F91] line-through">
                                ৳{product.price?.toLocaleString("bn-BD")}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-3.5 sm:mt-4 pt-2 border-t border-[#F2ECE4]">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.98] transition-all duration-200 shadow-xs"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#E0C9A6]" />
                        <span>কার্টে রাখুন</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCart;