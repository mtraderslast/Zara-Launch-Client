"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft, MapPin, Phone, ShieldCheck,
    ShoppingBag, Truck, User, Wallet, Loader2, CheckCircle2,
    ArrowRight
} from "lucide-react";
import Swal from "sweetalert2";
import { useCartStore } from "@/lib/store/useCartStore";
import { fetchProductDetails } from "@/lib/action/products";
import { createOrder } from "@/lib/action/order";

export default function CheckoutPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // প্রোডাক্ট ডাটা ক্যাশ রাখার স্টেট
    const [productCatalog, setProductCatalog] = useState({});
    const [isLoadingData, setIsLoadingData] = useState(true);

    // ফর্ম স্টেট
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "dhaka",
        note: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Zustand থেকে কার্ট ডাটা আনা
    const items = useCartStore((state) => state.items) || [];
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        setMounted(true);
    }, []);

    // লাইভ প্রোডাক্ট ডাটা ফেচিং
    useEffect(() => {
        const fetchCheckoutProducts = async () => {
            if (!items || items.length === 0) {
                setIsLoadingData(false);
                return;
            }

            const uniqueSlugs = [...new Set(items.map((item) => item.slug))];
            const missingSlugs = uniqueSlugs.filter((slug) => !productCatalog[slug]);

            if (missingSlugs.length === 0) {
                setIsLoadingData(false);
                return;
            }

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
                console.error("Checkout products fetch error:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchCheckoutProducts();
    }, [items, productCatalog]);

    // নির্দিষ্ট আইটেমের ফাইনাল ভ্যারিয়েন্ট বের করা
    const getMatchedVariant = (cartItem, product) => {
        if (!product?.hasVariants || !product?.variants?.length) return null;
        return product.variants.find((v) =>
            Object.entries(cartItem.selectedAttributes || {}).every(
                ([key, val]) => v.attributes?.[key] === val
            )
        ) || product.variants[0];
    };

    // নির্দিষ্ট আইটেমের ফাইনাল প্রাইস বের করার ফাংশন
    const getItemFinalPrice = (cartItem, product) => {
        if (!product) return 0;
        let itemPrice = product.price || 0;

        const matchedVariant = getMatchedVariant(cartItem, product);
        if (matchedVariant?.price && matchedVariant.price > 0) {
            itemPrice = matchedVariant.price;
        }

        const discountRate = product.discountRate || 0;
        return Math.round(itemPrice - (itemPrice * discountRate) / 100);
    };

    // সাবটোটাল হিসাব করা
    const subtotal = useMemo(() => {
        return items.reduce((total, cartItem) => {
            const product = productCatalog[cartItem.slug];
            const finalPrice = getItemFinalPrice(cartItem, product);
            return total + (finalPrice * cartItem.quantity);
        }, 0);
    }, [items, productCatalog]);

    const deliveryCharge = formData.city === "dhaka" ? 70 : 130;
    const totalAmount = subtotal + deliveryCharge;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
            Swal.fire({
                icon: "warning",
                title: "অসম্পূর্ণ তথ্য",
                text: "অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করুন।",
                confirmButtonColor: "#2C2724",
            });
            return;
        }

        // বিডি ফোন নম্বর ভ্যালিডেশন
        const bdPhoneRegex = /(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/;
        if (!bdPhoneRegex.test(formData.phone.trim())) {
            Swal.fire({
                icon: "warning",
                title: "সঠিক মোবাইল নম্বর দিন",
                text: "১১ ডিজিটের সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017xxxxxxxx)।",
                confirmButtonColor: "#2C2724",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const orderItemsPayload = items.map((item) => {
                const product = productCatalog[item.slug];
                const matchedVariant = getMatchedVariant(item, product);
                return {
                    slug: item.slug,
                    quantity: item.quantity,
                    variantSku: item.variantSku || matchedVariant?.sku || null,
                };
            });

            const orderPayload = {
                orderType: "single",
                name: formData.fullName.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                deliveryLocation: formData.city === "dhaka" ? "inside_dhaka" : "outside_dhaka",
                note: formData.note?.trim() || "",
                items: orderItemsPayload,
            };

            const response = await createOrder(orderPayload);
            const createdOrder = response?.data?.data || response?.data;

            if (clearCart) clearCart();

            const trackingId = createdOrder?.trackingId;
            router.push(`/order-success?trackingId=${trackingId}`);
        } catch (error) {
            console.error("Order placement failed:", error);
            const errorMsg = error?.response?.data?.message || error?.message || "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
            Swal.fire({
                icon: "error",
                title: "অর্ডার ব্যর্থ হয়েছে",
                text: errorMsg,
                confirmButtonColor: "#A8483B",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-[#EFE8DF] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <ShoppingBag className="w-10 h-10 text-[#9E7B66]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2724] font-serif mb-2">আপনার কার্ট খালি</h2>
                <p className="text-[#7C6E65] text-sm mb-8 text-center max-w-md">
                    চেকআউট করার জন্য আপনার শপিং ব্যাগে কোনো পণ্য নেই। অনুগ্রহ করে কিছু পণ্য যোগ করুন।
                </p>
                <Link
                    href="/products"
                    className="px-8 py-3 bg-[#2C2724] text-[#FAF8F5] rounded-xl text-sm font-bold tracking-wide hover:bg-[#3E3733] transition-colors shadow-sm"
                >
                    শপিং চালিয়ে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] pb-20">
            <header className="bg-white border-b border-[#E8E1D9] sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/products" className="flex items-center gap-2 text-[#7C6E65] hover:text-[#2C2724] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-semibold">ফিরে যান</span>
                    </Link>
                    <h1 className="text-lg font-bold font-serif text-[#2C2724] tracking-wide">নিরাপদ চেকআউট</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* লেফট কলাম: ফর্ম ও পেমেন্ট */}
                    <div className="flex-1 space-y-6">
                        {/* কাস্টমার ইনফরমেশন */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D9] shadow-sm">
                            <h2 className="text-lg font-bold text-[#2C2724] mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#9E7B66]" />
                                কাস্টমার ইনফরমেশন
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#5C534D] uppercase tracking-wider mb-2">আপনার নাম *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="সম্পূর্ণ নাম লিখুন"
                                        className="w-full px-4 py-3 rounded-xl border border-[#DDD3C7] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all text-sm text-[#2C2724]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#5C534D] uppercase tracking-wider mb-2">মোবাইল নাম্বার *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="w-4 h-4 text-[#A89F91]" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DDD3C7] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all text-sm text-[#2C2724]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ডেলিভারি এড্রেস */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D9] shadow-sm">
                            <h2 className="text-lg font-bold text-[#2C2724] mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#9E7B66]" />
                                ডেলিভারি ঠিকানা
                            </h2>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${formData.city === 'dhaka' ? 'bg-[#FAF8F5] border-[#2C2724]' : 'bg-white border-[#DDD3C7] hover:border-[#9E7B66]'}`}>
                                        <input type="radio" name="city" value="dhaka" checked={formData.city === 'dhaka'} onChange={handleInputChange} className="sr-only" />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="block text-sm font-bold text-[#2C2724]">ঢাকার ভিতরে</span>
                                                <span className="mt-1 flex items-center text-xs text-[#8C7A6B]">ডেলিভারি চার্জ: ৳৭০</span>
                                            </span>
                                        </span>
                                        <CheckCircle2 className={`w-5 h-5 ${formData.city === 'dhaka' ? 'text-[#2C2724]' : 'text-transparent'}`} />
                                    </label>

                                    <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${formData.city === 'outside' ? 'bg-[#FAF8F5] border-[#2C2724]' : 'bg-white border-[#DDD3C7] hover:border-[#9E7B66]'}`}>
                                        <input type="radio" name="city" value="outside" checked={formData.city === 'outside'} onChange={handleInputChange} className="sr-only" />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="block text-sm font-bold text-[#2C2724]">ঢাকার বাহিরে</span>
                                                <span className="mt-1 flex items-center text-xs text-[#8C7A6B]">ডেলিভারি চার্জ: ৳১৩০</span>
                                            </span>
                                        </span>
                                        <CheckCircle2 className={`w-5 h-5 ${formData.city === 'outside' ? 'text-[#2C2724]' : 'text-transparent'}`} />
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#5C534D] uppercase tracking-wider mb-2">সম্পূর্ণ ঠিকানা *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="বাড়ি নং, রোড নং, এলাকা, থানা/উপজেলা, জেলা"
                                        className="w-full px-4 py-3 rounded-xl border border-[#DDD3C7] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all text-sm text-[#2C2724] resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#5C534D] uppercase tracking-wider mb-2">স্পেশাল নোট (ঐচ্ছিক)</label>
                                    <input
                                        type="text"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        placeholder="ডেলিভারি সংক্রান্ত কোনো নির্দেশনা থাকলে লিখুন"
                                        className="w-full px-4 py-3 rounded-xl border border-[#DDD3C7] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all text-sm text-[#2C2724]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* পেমেন্ট মেথড */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D9] shadow-sm">
                            <h2 className="text-lg font-bold text-[#2C2724] mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-[#9E7B66]" />
                                পেমেন্ট মেথড
                            </h2>

                            <div className="space-y-3">
                                <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${paymentMethod === 'cod' ? 'bg-[#FAF8F5] border-[#2C2724]' : 'bg-white border-[#DDD3C7]'}`}>
                                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                                    <div className="flex items-center w-full gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#EFE8DF] flex items-center justify-center shrink-0">
                                            <Truck className="w-5 h-5 text-[#9E7B66]" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="block text-sm font-bold text-[#2C2724]">ক্যাশ অন ডেলিভারি (COD)</span>
                                            <span className="block text-xs text-[#8C7A6B] mt-0.5">পণ্য হাতে পেয়ে পেমেন্ট করুন</span>
                                        </div>
                                        <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#2C2724]' : 'text-transparent'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* রাইট কলাম: অর্ডার সামারি */}
                    <div className="lg:w-[420px] xl:w-[460px] shrink-0">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D9] shadow-lg lg:sticky lg:top-24">
                            <h2 className="text-lg font-bold text-[#2C2724] mb-6 border-b border-[#E8E1D9] pb-4 font-serif">
                                অর্ডার সামারি
                            </h2>

                            {isLoadingData ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#9E7B66]" />
                                    <p className="text-sm text-[#8C7A6B]">প্রোডাক্ট ডাটা লোড হচ্ছে...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 mb-6 divide-y divide-[#F4ECE4]">
                                        {items.map((cartItem) => {
                                            const product = productCatalog[cartItem.slug];
                                            if (!product) return null;

                                            const variantEntries = Object.entries(cartItem.selectedAttributes || {});
                                            const finalPrice = getItemFinalPrice(cartItem, product);

                                            return (
                                                <div key={cartItem.cartItemId || cartItem.slug} className="flex gap-4 pt-4 first:pt-0">
                                                    <div className="relative w-16 h-20 rounded-lg bg-[#F5EFE9] overflow-hidden shrink-0 border border-[#E8E1D9]">
                                                        <img
                                                            src={product.images?.[0] || "/placeholder.jpg"}
                                                            alt={product.titleBn || product.titleEn}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#2C2724] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                                                            {cartItem.quantity}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <h4 className="text-sm font-semibold text-[#2C2724] line-clamp-2 leading-snug">
                                                            {product.titleBn || product.titleEn}
                                                        </h4>

                                                        {variantEntries.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                                {variantEntries.map(([key, value]) => (
                                                                    <span key={key} className="px-1.5 py-0.5 text-[10px] font-medium bg-[#F6F1EA] text-[#5C534D] rounded">
                                                                        {value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-right flex flex-col justify-center">
                                                        <span className="font-bold text-[#2C2724] text-sm">
                                                            ৳{(finalPrice * cartItem.quantity).toLocaleString("bn-BD")}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* খরচ ব্রেকডাউন */}
                                    <div className="space-y-3 pt-6 border-t border-[#E8E1D9] mb-6 text-sm">
                                        <div className="flex justify-between text-[#5C534D]">
                                            <span>সাবটোটাল</span>
                                            <span className="font-semibold text-[#2C2724]">৳{subtotal.toLocaleString("bn-BD")}</span>
                                        </div>
                                        <div className="flex justify-between text-[#5C534D]">
                                            <span>ডেলিভারি চার্জ</span>
                                            <span className="font-semibold text-[#2C2724]">৳{deliveryCharge.toLocaleString("bn-BD")}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-4 border-t border-[#2C2724] mb-6">
                                        <span className="text-base font-bold text-[#2C2724] uppercase tracking-wider">সর্বমোট</span>
                                        <span className="text-2xl font-bold font-serif text-[#9E7B66]">
                                            ৳{totalAmount.toLocaleString("bn-BD")}
                                        </span>
                                    </div>

                                    {/* ট্রাস্ট ব্যাজ */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#F2ECE4]">
                                            <ShieldCheck className="w-4 h-4 text-[#9E7B66] shrink-0" />
                                            <span className="text-[10px] font-bold text-[#5C534D] leading-tight">১০০% অরিজিনাল<br />প্রোডাক্ট গ্যারান্টি</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#F2ECE4]">
                                            <Truck className="w-4 h-4 text-[#9E7B66] shrink-0" />
                                            <span className="text-[10px] font-bold text-[#5C534D] leading-tight">দ্রুত ও নিরাপদ<br />ডেলিভারি সুবিধা</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || items.length === 0}
                                        className="w-full h-14 bg-[#2C2724] text-[#FAF8F5] rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-[#3E3733] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-[#2C2724]/10"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>অর্ডার প্রসেস হচ্ছে...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>অর্ডার কনফার্ম করুন</span>
                                                <ArrowRight className="w-4 h-4 text-[#E0C9A6]" />
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}