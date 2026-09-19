"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";


export default function CartDrawer() {
    const [mounted, setMounted] = useState(false);
    const items = useCartStore((state) => state.items);
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const getTotalItems = useCartStore((state) => state.getTotalItems);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    const subtotal = getSubtotal();
    const totalCount = getTotalItems();

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            aria-labelledby="slide-over-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#201C1A]/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={closeCart}
            />

            {/* Slide Drawer */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
                <aside
                    className={`w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E1D9] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-[#E8E1D9] flex items-center justify-between bg-[#FAF8F5]">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-[#9E7B66]" />
                            <h2 id="slide-over-title" className="font-serif text-lg font-bold text-[#2C2724]">
                                শপিং ব্যাগ{" "}
                                <span className="text-xs font-sans font-medium text-[#8C7A6B]">
                                    ({totalCount.toLocaleString("bn-BD")} টি আইটেম)
                                </span>
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={closeCart}
                            className="p-1.5 rounded-full text-[#7C6E65] hover:text-[#2C2724] hover:bg-[#EFE8DF] transition-colors"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                <div className="w-16 h-16 rounded-full bg-[#EFE8DF] flex items-center justify-center text-[#9E7B66]">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-medium text-[#2C2724]">আপনার ব্যাগ ফাঁকা</p>
                                    <p className="text-xs text-[#8C7A6B]">আপনার পছন্দের প্রোডাক্ট যোগ করতে ব্রাউজ করুন</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeCart}
                                    className="mt-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] transition-colors shadow-xs"
                                >
                                    শপিং শুরু করুন
                                </button>
                            </div>
                        ) : (
                            items.map((item) => {
                                const variantEntries = Object.entries(item.selectedVariants || {});

                                return (
                                    <div
                                        key={item.cartItemId}
                                        className="flex gap-3.5 p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E1D9] shadow-2xs"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-20 h-24 rounded-lg bg-[#F5EFE9] overflow-hidden shrink-0 border border-[#E8E1D9]">
                                            <Image
                                                src={item.image}
                                                alt={item.titleBn || item.titleEn || "Product"}
                                                fill
                                                sizes="80px"
                                                className="object-cover object-center"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        {item.titleBn && (
                                                            <h3 className="text-xs sm:text-sm font-semibold text-[#2C2724] line-clamp-1">
                                                                {item.titleBn}
                                                            </h3>
                                                        )}
                                                        {item.titleEn && (
                                                            <p className="text-[11px] font-sans text-[#8C7A6B] line-clamp-1">
                                                                {item.titleEn}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.cartItemId)}
                                                        className="text-[#A89F91] hover:text-[#C55043] transition-colors p-1"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Variant Badges */}
                                                {variantEntries.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                                        {variantEntries.map(([key, value]) => (
                                                            <span
                                                                key={key}
                                                                className="px-1.5 py-0.5 text-[10px] font-medium bg-[#F6F1EA] text-[#5C534D] rounded border border-[#E8E1D9]"
                                                            >
                                                                {key}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Quantity Controls */}
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center border border-[#DDD3C7] rounded-lg bg-[#FAF8F5]">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                        className="p-1 hover:bg-[#EDE6DC] text-[#2C2724] rounded-l-lg transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-semibold text-[#2C2724]">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                        className="p-1 hover:bg-[#EDE6DC] text-[#2C2724] rounded-r-lg transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <span className="font-serif text-sm font-bold text-[#2C2724]">
                                                        ৳{(item.price * item.quantity).toLocaleString("bn-BD")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer Summary */}
                    {items.length > 0 && (
                        <div className="p-4 sm:p-5 border-t border-[#E8E1D9] bg-[#FAF8F5] space-y-3.5">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#7C6E65]">সাবটোটাল (Subtotal)</span>
                                    <span className="font-serif text-base font-bold text-[#2C2724]">
                                        ৳{subtotal.toLocaleString("bn-BD")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
                                    <span>ডেলিভারি চার্জ</span>
                                    <span>চেকআউট পেজে গণনা করা হবে</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="w-full py-3 px-4 rounded-xl bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.99] text-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                    <span>অর্ডার সম্পন্ন করুন</span>
                                    <ArrowRight className="w-4 h-4 text-[#E0C9A6]" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={closeCart}
                                    className="w-full py-2 text-xs font-medium text-[#7C6E65] hover:text-[#2C2724] text-center transition-colors"
                                >
                                    আরও কেনাকাটা চালিয়ে যান
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}