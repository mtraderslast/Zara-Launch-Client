"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { fetchProductDetails } from "@/lib/action/products";

export default function CartDrawer() {
    const [mounted, setMounted] = useState(false);
    const [productCatalog, setProductCatalog] = useState({});
    const [isLoadingData, setIsLoadingData] = useState(false);

    const items = useCartStore((state) => state.items);
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
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

    useEffect(() => {
        const fetchCartProducts = async () => {
            const missingSlugs = items
                .map((item) => item.slug)
                .filter((slug) => !productCatalog[slug]);

            if (missingSlugs.length === 0) return;

            setIsLoadingData(true);
            try {
                const newProducts = {};
                await Promise.all(
                    missingSlugs.map(async (slug) => {
                        const res = await fetchProductDetails(slug);
                        const productData = res?.data?.data || res?.data || res;
                        if (productData) {
                            newProducts[slug] = productData;
                        }
                    })
                );

                setProductCatalog((prev) => ({ ...prev, ...newProducts }));
            } catch (error) {
                console.error("Cart items fetch error:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchCartProducts();
    }, [items, productCatalog]);

    const getItemFinalPrice = (cartItem, product) => {
        if (!product) return 0;

        let itemPrice = product.price || 0;

        if (product.hasVariants && product.variants?.length > 0) {
            const matchedVariant = product.variants.find((v) =>
                Object.entries(cartItem.selectedAttributes || {}).every(
                    ([key, val]) => v.attributes?.[key] === val
                )
            );

            if (matchedVariant && matchedVariant.price !== undefined) {
                itemPrice = matchedVariant.price;
            } else if (product.variants[0]?.price !== undefined) {
                itemPrice = product.variants[0].price;
            }
        }

        const discountRate = product.discountRate || 0;
        return Math.round(itemPrice - (itemPrice * discountRate) / 100);
    };

    const subtotal = useMemo(() => {
        return items.reduce((total, cartItem) => {
            const product = productCatalog[cartItem.slug];
            const finalPrice = getItemFinalPrice(cartItem, product);
            return total + (finalPrice * cartItem.quantity);
        }, 0);
    }, [items, productCatalog]);

    if (!mounted) return null;

    const totalCount = getTotalItems();

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-labelledby="slide-over-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-[#201C1A]/60 backdrop-blur-xs transition-opacity duration-300" onClick={closeCart} />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
                <aside className={`w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E1D9] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                    <div className="p-4 sm:p-5 border-b border-[#E8E1D9] flex items-center justify-between bg-[#FAF8F5]">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-[#9E7B66]" />
                            <h2 id="slide-over-title" className="font-serif text-lg font-bold text-[#2C2724]">
                                শপিং ব্যাগ <span className="text-xs font-sans font-medium text-[#8C7A6B]">({totalCount.toLocaleString("bn-BD")} টি আইটেম)</span>
                            </h2>
                        </div>
                        <button type="button" onClick={closeCart} className="p-1.5 rounded-full text-[#7C6E65] hover:text-[#2C2724] hover:bg-[#EFE8DF] transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

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
                                <button type="button" onClick={closeCart} className="mt-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] transition-colors shadow-xs">
                                    শপিং শুরু করুন
                                </button>
                            </div>
                        ) : isLoadingData && Object.keys(productCatalog).length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[#9E7B66]" />
                                <p className="text-sm font-medium text-[#7C6E65]">কার্ট লোড হচ্ছে...</p>
                            </div>
                        ) : (
                            items.map((cartItem) => {
                                const product = productCatalog[cartItem.slug];
                                if (!product) return null;

                                const variantEntries = Object.entries(cartItem.selectedAttributes || {});
                                const finalPrice = getItemFinalPrice(cartItem, product);

                                return (
                                    <div key={cartItem.cartItemId} className="flex gap-3.5 p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E1D9] shadow-2xs">
                                        <div className="relative w-20 h-24 rounded-lg bg-[#F5EFE9] overflow-hidden shrink-0 border border-[#E8E1D9]">
                                            <img
                                                src={product.images?.[0] || "/placeholder.jpg"}
                                                alt={product.titleBn || "Product"}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="text-xs sm:text-sm font-semibold text-[#2C2724] line-clamp-1">{product.titleBn}</h3>
                                                        {product.titleEn && <p className="text-[11px] font-sans text-[#8C7A6B] line-clamp-1">{product.titleEn}</p>}
                                                    </div>
                                                    <button type="button" onClick={(e) => { e.preventDefault(); removeFromCart(cartItem.cartItemId); }} className="text-[#A89F91] hover:text-[#C55043] transition-colors p-1">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {variantEntries.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                                        {variantEntries.map(([key, value]) => (
                                                            <span key={key} className="px-1.5 py-0.5 text-[10px] font-medium bg-[#F6F1EA] text-[#5C534D] rounded border border-[#E8E1D9]">{key}: {value}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center border border-[#DDD3C7] rounded-lg bg-[#FAF8F5]">
                                                    <button type="button" onClick={(e) => { e.preventDefault(); updateQuantity(cartItem.cartItemId, cartItem.quantity - 1); }} className="p-1 hover:bg-[#EDE6DC] text-[#2C2724] rounded-l-lg transition-colors">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-semibold text-[#2C2724]">{cartItem.quantity}</span>
                                                    <button type="button" onClick={(e) => { e.preventDefault(); updateQuantity(cartItem.cartItemId, cartItem.quantity + 1); }} className="p-1 hover:bg-[#EDE6DC] text-[#2C2724] rounded-r-lg transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="text-right flex flex-col">
                                                    <span className="font-serif text-sm font-bold text-[#2C2724]">
                                                        ৳{(finalPrice * cartItem.quantity).toLocaleString("bn-BD")}
                                                    </span>
                                                    <span className="text-[10px] text-[#8C7A6B]">
                                                        ৳{finalPrice.toLocaleString("bn-BD")} x {cartItem.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

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
                                <Link href="/checkout" onClick={closeCart} className="w-full py-3 px-4 rounded-xl bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.99] text-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm">
                                    <span>অর্ডার সম্পন্ন করুন</span>
                                    <ArrowRight className="w-4 h-4 text-[#E0C9A6]" />
                                </Link>
                                <button type="button" onClick={closeCart} className="w-full py-2 text-xs font-medium text-[#7C6E65] hover:text-[#2C2724] text-center transition-colors">
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