"use client";

import { useState, useEffect, useMemo, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Zap,
    Truck,
    ShieldCheck,
    RotateCcw,
    Plus,
    Minus,
    Star,
    Send,
    User,
    Loader2,
    AlertCircle,
    Check,
    ChevronRight,
    PhoneCall,
    MessageCircle,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import Swal from "sweetalert2";
import { useCartStore } from "@/lib/store/useCartStore";
import { fetchProductReviews, createReview, updateReview, deleteReview } from "@/lib/action/review";
import { fetchProductDetails } from "@/lib/action/products";

const extractReviews = (res) => {
    const candidates = [
        res?.data?.data?.reviews,
        res?.data?.reviews,
        res?.data?.data,
        res?.data,
        res?.reviews,
        res,
    ];
    for (const c of candidates) {
        if (Array.isArray(c)) return c;
    }
    return [];
};

const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("bn-BD");
};

const getReviewUser = (rev) => ({
    name:
        (typeof rev?.userName === "string" && rev.userName) ||
        rev?.user?.name ||
        rev?.user?.fullName ||
        "গ্রাহক",
    image: rev?.userImage || rev?.user?.image || null,
});

export default function ProductDetailPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const currentSlug = resolvedParams.slug;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [zoom, setZoom] = useState({ active: false, origin: "50% 50%" });
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [quantity, setQuantity] = useState(1);

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [submittingReview, setSubmittingReview] = useState(false);

    const addToCart = useCartStore((state) => state.addToCart);

    const loadReviews = useCallback(async (productId) => {
        if (!productId) return;
        setLoadingReviews(true);
        try {
            const res = await fetchProductReviews(productId);
            setReviews(extractReviews(res));
        } catch (err) {
            console.error("Reviews load error:", err);
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        setActiveImageIndex(0);
        setQuantity(1);

        fetchProductDetails(currentSlug)
            .then((res) => {
                if (!isMounted) return;
                const data = res?.data?.data || res?.data || res;
                if (!data || !data._id) {
                    setError("পণ্যটি খুঁজে পাওয়া যায়নি");
                    return;
                }
                setProduct(data);

                if (data.hasVariants && data.variants?.length > 0) {
                    setSelectedAttributes(data.variants[0]?.attributes || {});
                }
                loadReviews(data._id);
            })
            .catch((err) => {
                if (isMounted) setError(err?.message || "ডাটা লোড করতে সমস্যা হয়েছে");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [currentSlug, loadReviews]);

    const attributeOptions = useMemo(() => {
        if (!product?.hasVariants || !product?.variants) return {};
        const options = {};
        product.variants.forEach((variant) => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, val]) => {
                    if (!options[key]) options[key] = new Set();
                    options[key].add(val);
                });
            }
        });
        const formatted = {};
        Object.keys(options).forEach((key) => {
            formatted[key] = Array.from(options[key]);
        });
        return formatted;
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product?.hasVariants || !product?.variants?.length) return null;
        return (
            product.variants.find((v) =>
                Object.entries(selectedAttributes).every(
                    ([key, val]) => v.attributes?.[key] === val
                )
            ) || product.variants[0]
        );
    }, [product, selectedAttributes]);

    const basePrice = activeVariant?.price ?? product?.price ?? 0;
    const discountRate = product?.discountRate ?? 0;
    const discountedPrice = Math.round(basePrice - (basePrice * discountRate) / 100);
    const savedAmount = basePrice - discountedPrice;
    const currentStock = activeVariant ? activeVariant.stock ?? 0 : product?.stock ?? 10;
    const isOutOfStock = currentStock <= 0;

    useEffect(() => {
        setQuantity((q) => Math.max(1, Math.min(q, Math.max(currentStock, 1))));
    }, [currentStock]);

    const ratingStats = useMemo(() => {
        const total = reviews.length;
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;
        reviews.forEach((r) => {
            const v = Math.round(Number(r.rating) || 0);
            if (v >= 1 && v <= 5) counts[v] += 1;
            sum += Number(r.rating) || 0;
        });
        return { total, counts, average: total ? sum / total : 0 };
    }, [reviews]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoom({ active: true, origin: `${x}% ${y}%` });
    };

    const handleMouseLeave = () => setZoom({ active: false, origin: "50% 50%" });

    const handleAddToCart = (showSuccessAlert = true) => {
        if (isOutOfStock || !product) {
            Swal.fire({
                icon: "error",
                title: "স্টক শেষ!",
                text: "দুঃখিত, এই ভ্যারিয়েন্টের পণ্যটি বর্তমানে স্টকে নেই।",
                confirmButtonColor: "#2C2724",
            });
            return false;
        }

        addToCart(product.slug, quantity, selectedAttributes, activeVariant?.sku || null);

        if (showSuccessAlert) {
            Swal.fire({
                icon: "success",
                title: "কার্টে যোগ করা হয়েছে!",
                text: `"${product.titleBn}" সফলভাবে কার্টে যুক্ত হয়েছে।`,
                showCancelButton: true,
                confirmButtonColor: "#2C2724",
                cancelButtonColor: "#9E7B66",
                confirmButtonText: "চেকআউটে যান",
                cancelButtonText: "আরও কেনাকাটা করুন",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/checkout");
                }
            });
        }
        return true;
    };

    const handleDirectOrder = () => {
        const isAdded = handleAddToCart(false);
        if (isAdded) {
            router.push("/checkout");
        }
    };

    const handleStartEdit = (rev) => {
        const id = rev._id || rev.id;
        setEditingReviewId(id);
        setRating(Number(rev.rating) || 5);
        setComment(rev.comment || "");

        const formElement = document.getElementById("review-form-box");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setRating(5);
        setHoverRating(0);
        setComment("");
    };

    const handleDeleteReview = async (reviewId) => {
        const confirmResult = await Swal.fire({
            title: "রিভিউ ডিলিট করতে চান?",
            text: "আপনি কি নিশ্চিত যে এই রিভিউটি মুছে ফেলতে চান?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#A8483B",
            cancelButtonColor: "#2C2724",
            confirmButtonText: "হ্যাঁ, ডিলিট করুন",
            cancelButtonText: "বাতিল",
        });

        if (confirmResult.isConfirmed) {
            try {
                if (deleteReview.length <= 1) {
                    await deleteReview(reviewId);
                } else {
                    await deleteReview(reviewId, { productId: product._id });
                }

                Swal.fire({
                    icon: "success",
                    title: "ডিলিট সম্পন্ন!",
                    text: "রিভিউটি সফলভাবে মুছে ফেলা হয়েছে।",
                    confirmButtonColor: "#2C2724",
                    timer: 2000,
                    showConfirmButton: false,
                });

                if (editingReviewId === reviewId) {
                    handleCancelEdit();
                }

                loadReviews(product._id);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "ব্যর্থ হয়েছে",
                    text: err?.response?.data?.message || err?.message || "রিভিউ ডিলিট করা সম্ভব হয়নি।",
                    confirmButtonColor: "#A8483B",
                });
            }
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim().length < 3) {
            Swal.fire({
                icon: "warning",
                title: "মন্তব্য অসম্পূর্ণ",
                text: "রিভিউ মন্তব্য কমপক্ষে ৩ অক্ষরের হতে হবে।",
                confirmButtonColor: "#2C2724",
            });
            return;
        }

        setSubmittingReview(true);
        try {
            if (editingReviewId) {
                if (updateReview.length <= 1) {
                    await updateReview({
                        reviewId: editingReviewId,
                        id: editingReviewId,
                        rating,
                        comment: comment.trim(),
                        productId: product._id,
                    });
                } else {
                    await updateReview(editingReviewId, {
                        rating,
                        comment: comment.trim(),
                        productId: product._id,
                    });
                }

                setEditingReviewId(null);
                setComment("");
                setRating(5);
                setHoverRating(0);

                Swal.fire({
                    icon: "success",
                    title: "আপডেট সম্পন্ন!",
                    text: "আপনার রিভিউ সফলভাবে আপডেট করা হয়েছে।",
                    confirmButtonColor: "#2C2724",
                    timer: 2500,
                    showConfirmButton: false,
                });
            } else {
                await createReview({
                    productId: product._id,
                    rating,
                    comment: comment.trim(),
                });
                setComment("");
                setRating(5);
                setHoverRating(0);

                Swal.fire({
                    icon: "success",
                    title: "ধন্যবাদ!",
                    text: "আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।",
                    confirmButtonColor: "#2C2724",
                    timer: 2500,
                    showConfirmButton: false,
                });
            }

            loadReviews(product._id);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: editingReviewId ? "আপডেট ব্যর্থ হয়েছে" : "রিভিউ জমা দেওয়া যায়নি",
                text:
                    err?.response?.data?.message ||
                    err?.message ||
                    (editingReviewId
                        ? "রিভিউ আপডেট করা সম্ভব হয়নি।"
                        : "রিভিউ জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে আপনার লগইন স্ট্যাটাস চেক করুন।"),
                confirmButtonColor: "#A8483B",
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    const shopPhoneNumber = "01939074820";
    const variantInfoText = Object.entries(selectedAttributes)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    const whatsappText = encodeURIComponent(
        `আসসালামু আলাইকুম! আমি "${product?.titleBn}" অর্ডার করতে চাই।\n` +
        (variantInfoText ? `ভ্যারিয়েন্ট: ${variantInfoText}\n` : "") +
        `পরিমাণ: ${quantity} টি\n` +
        `মূল্য: ৳${(discountedPrice * quantity).toLocaleString("bn-BD")}`
    );
    const whatsappUrl = `https://wa.me/8801891547609?text=${whatsappText}`;

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#9E7B66]" />
                <p className="text-sm font-medium text-[#7C6E65]">লোড হচ্ছে...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 text-center">
                <AlertCircle className="w-10 h-10 text-[#A8483B] mb-3" />
                <h2 className="text-lg font-bold text-[#2C2724]">{error || "পণ্য খুঁজে পাওয়া যায়নি"}</h2>
                <Link
                    href="/"
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#2C2724] text-[#FAF8F5] text-xs font-semibold"
                >
                    হোমে ফিরে যান
                </Link>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div className="w-full min-h-screen bg-[#FAF8F5] text-[#2C2724]">
            <div className="mx-auto px-4 py-6 sm:py-8">

                {/* মেইন সেকশন */}
                <div className="bg-white border border-[#E8E1D9] rounded-2xl p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-6">

                    {/* গ্যালারি */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 lg:sticky lg:top-6 h-fit">
                        {images.length > 1 && (
                            <div className="flex sm:flex-col gap-2.5 sm:max-h-[520px] overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden shrink-0 pb-1 sm:pb-0">
                                {images.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-lg overflow-hidden border-2 shrink-0 bg-[#FAF8F5] transition-all ${activeImageIndex === idx
                                            ? "border-[#2C2724]"
                                            : "border-transparent opacity-70 hover:opacity-100 hover:border-[#DDD3C7]"
                                            }`}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div
                            className="relative flex-1 aspect-square max-h-[560px] bg-[#FAF8F5] rounded-xl border border-[#E8E1D9] overflow-hidden cursor-zoom-in select-none"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            {images[activeImageIndex] ? (
                                <img
                                    src={images[activeImageIndex]}
                                    alt={product.titleBn}
                                    className="w-full h-full object-contain pointer-events-none transition-transform duration-150 ease-out"
                                    style={{
                                        transform: zoom.active ? "scale(2)" : "scale(1)",
                                        transformOrigin: zoom.origin,
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm text-[#A89F91]">
                                    ছবি নেই
                                </div>
                            )}

                            {discountRate > 0 && (
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold bg-[#A8483B] text-white">
                                    -{discountRate}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* প্রোডাক্ট তথ্য */}
                    <div className="space-y-5">
                        <div>
                            {product.brand && (
                                <span className="text-xs uppercase tracking-wider text-[#9E7B66] font-semibold block mb-1.5">
                                    {product.brand}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2724] leading-snug">
                                {product.titleBn}
                            </h1>
                            {product.titleEn && (
                                <p className="text-sm text-[#8C7A6B] mt-1">{product.titleEn}</p>
                            )}
                        </div>

                        {/* দাম ও সাশ্রয় */}
                        <div className="rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] px-5 py-4">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className="text-3xl sm:text-4xl font-bold text-[#2C2724]">
                                    ৳{discountedPrice.toLocaleString("bn-BD")}
                                </span>
                                {discountRate > 0 && (
                                    <>
                                        <span className="text-base text-[#A89F91] line-through">
                                            ৳{basePrice.toLocaleString("bn-BD")}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#A8483B] text-white">
                                            {discountRate.toLocaleString("bn-BD")}% ছাড়
                                        </span>
                                    </>
                                )}
                            </div>
                            {discountRate > 0 && (
                                <p className="text-xs text-emerald-700 font-medium mt-1">
                                    আপনি সাশ্রয় করছেন ৳{savedAmount.toLocaleString("bn-BD")}
                                </p>
                            )}
                        </div>

                        {/* ভ্যারিয়েন্ট সিলেকশন */}
                        {product.hasVariants && Object.keys(attributeOptions).length > 0 && (
                            <div className="space-y-4">
                                {Object.entries(attributeOptions).map(([key, values]) => {
                                    const lower = key.toLowerCase();
                                    return (
                                        <div key={key} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2724]">
                                                    {lower === "color" ? "কালার" : lower === "size" ? "সাইজ" : key}:
                                                </span>
                                                <span className="text-xs font-bold text-[#9E7B66]">
                                                    {selectedAttributes[key]}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {values.map((val) => {
                                                    const isSelected = selectedAttributes[key] === val;
                                                    return (
                                                        <button
                                                            key={val}
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedAttributes((prev) => ({ ...prev, [key]: val }))
                                                            }
                                                            className={`min-w-[48px] px-4 py-2 text-sm font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${isSelected
                                                                ? "bg-[#2C2724] text-[#FAF8F5] border-[#2C2724]"
                                                                : "bg-white text-[#5C534D] border-[#DDD3C7] hover:border-[#2C2724]"
                                                                }`}
                                                        >
                                                            {isSelected && <Check className="w-3.5 h-3.5 text-[#E0C9A6]" />}
                                                            <span>{val}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* পরিমাণ */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider block text-[#2C2724]">
                                পরিমাণ
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-[#DDD3C7] rounded-lg bg-white w-max">
                                    <button
                                        type="button"
                                        disabled={quantity <= 1}
                                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                        className="p-3 hover:bg-[#FAF8F5] text-[#2C2724] disabled:opacity-30"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-14 text-center text-sm font-bold text-[#2C2724]">
                                        {quantity.toLocaleString("bn-BD")}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={quantity >= currentStock}
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                        className="p-3 hover:bg-[#FAF8F5] text-[#2C2724] disabled:opacity-30"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className={`text-xs font-semibold ${!isOutOfStock ? "text-emerald-700" : "text-[#A8483B]"}`}>
                                    {!isOutOfStock ? `স্টকে আছে (${currentStock})` : "স্টক আউট"}
                                </span>
                            </div>
                        </div>

                        {/* প্রধান অ্যাকশন বাটন */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isOutOfStock}
                                onClick={handleDirectOrder}
                                className="flex-1 h-12 px-6 rounded-xl bg-[#2C2724] text-[#FAF8F5] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3E3733] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.99]"
                            >
                                <Zap className="w-4 h-4 text-[#E0C9A6] fill-[#E0C9A6]" />
                                <span>{!isOutOfStock ? "এখনই অর্ডার করুন" : "স্টক শেষ"}</span>
                            </button>

                            <button
                                type="button"
                                disabled={isOutOfStock}
                                onClick={() => handleAddToCart(true)}
                                className="flex-1 h-12 px-6 rounded-xl bg-white text-[#2C2724] border-2 border-[#2C2724] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
                            >
                                <ShoppingBag className="w-4 h-4 text-[#9E7B66]" />
                                <span>কার্টে যোগ করুন</span>
                            </button>
                        </div>

                        {/* কল টু অর্ডার এবং হোয়াটসঅ্যাপ বাটন */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <a
                                href={`tel:${shopPhoneNumber}`}
                                className="h-11 px-4 rounded-xl border border-[#DDD3C7] bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#2C2724] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                            >
                                <PhoneCall className="w-4 h-4 text-[#9E7B66]" />
                                <span>কল করে অর্ডার করুন</span>
                            </a>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-11 px-4 rounded-xl border border-[#25D366]/40 bg-[#F2FAF4] hover:bg-[#E3F7E8] text-[#1E7E34] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                            >
                                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                <span>হোয়াটসঅ্যাপে অর্ডার</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* বিবরণ ও স্পেসিফিকেশন */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    <section className="lg:col-span-7 bg-white border border-[#E8E1D9] rounded-2xl p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-[#2C2724] pb-3 mb-4 border-b border-[#E8E1D9]">
                            পণ্যের বিবরণ
                        </h2>
                        <div className="text-sm text-[#5C534D] leading-7 whitespace-pre-line">
                            {product.descriptionBn || "কোনো বিবরণ প্রদান করা হয়নি।"}
                        </div>
                    </section>

                    <section className="lg:col-span-5 bg-white border border-[#E8E1D9] rounded-2xl p-6 sm:p-8 h-fit">
                        <h2 className="text-lg font-bold text-[#2C2724] pb-3 mb-4 border-b border-[#E8E1D9]">
                            স্পেসিফিকেশন
                        </h2>
                        <div className="border border-[#E8E1D9] rounded-xl overflow-hidden text-sm divide-y divide-[#E8E1D9]">
                            {[
                                { label: "ব্র্যান্ড", value: product.brand },
                                { label: "ক্যাটাগরি", value: product.category },
                                { label: "সাব-ক্যাটাগরি", value: product.subCategory },
                                { label: "SKU", value: activeVariant?.sku, mono: true },
                            ]
                                .filter((row) => row.value)
                                .map((row, i) => (
                                    <div
                                        key={row.label}
                                        className={`grid grid-cols-2 gap-2 px-4 py-3 ${i % 2 === 0 ? "bg-[#FAF8F5]" : "bg-white"}`}
                                    >
                                        <span className="font-semibold text-[#2C2724]">{row.label}</span>
                                        <span className={`text-[#5C534D] ${row.mono ? "font-mono" : ""}`}>
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                        </div>

                        {product.tags?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {product.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E8E1D9] text-[#7C6E65] text-xs rounded-md"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* কাস্টমার রিভিউ সেকশন */}
                <section className="bg-white border border-[#E8E1D9] rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-bold text-[#2C2724] pb-3 mb-6 border-b border-[#E8E1D9]">
                        কাস্টমার রিভিউ ({ratingStats.total.toLocaleString("bn-BD")})
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* রেটিং সামারি ও রিভিউ ফর্ম */}
                        <div className="lg:col-span-5 space-y-5">
                            <div className="flex items-center gap-6 p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9]">
                                <div className="text-center shrink-0">
                                    <div className="text-4xl font-bold text-[#2C2724]">
                                        {ratingStats.total ? ratingStats.average.toFixed(1) : "০.০"}
                                    </div>
                                    <div className="flex justify-center mt-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3.5 h-3.5 ${s <= Math.round(ratingStats.average)
                                                    ? "fill-[#C89B3C] text-[#C89B3C]"
                                                    : "text-[#D9D1C7]"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-[11px] text-[#8C7A6B] mt-1">
                                        {ratingStats.total.toLocaleString("bn-BD")} টি রিভিউ
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const pct = ratingStats.total
                                            ? (ratingStats.counts[star] / ratingStats.total) * 100
                                            : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-[11px] text-[#7C6E65]">
                                                <span className="w-3">{star}</span>
                                                <div className="flex-1 h-1.5 rounded-full bg-[#E8E1D9] overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#C89B3C] rounded-full"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="w-5 text-right">{ratingStats.counts[star]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div id="review-form-box" className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-sm text-[#2C2724]">
                                        {editingReviewId ? "রিভিউ আপডেট করুন" : "একটি রিভিউ লিখুন"}
                                    </h3>
                                    {editingReviewId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="text-xs text-[#A8483B] hover:underline flex items-center gap-1 font-medium"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            বাতিল করুন
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#2C2724] mb-1">
                                            রেটিং দিন
                                        </label>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-1 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 ${star <= (hoverRating || rating)
                                                            ? "fill-[#C89B3C] text-[#C89B3C]"
                                                            : "text-[#D9D1C7]"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#2C2724] mb-1">
                                            আপনার মন্তব্য
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..."
                                            className="w-full text-sm p-3 rounded-lg border border-[#DDD3C7] bg-white focus:outline-none focus:border-[#2C2724] resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="submit"
                                            disabled={submittingReview}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2C2724] text-[#FAF8F5] text-sm font-semibold hover:bg-[#3E3733] transition-colors disabled:opacity-50"
                                        >
                                            {submittingReview ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                            <span>{editingReviewId ? "আপডেট করুন" : "রিভিউ দিন"}</span>
                                        </button>

                                        {editingReviewId && (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2.5 rounded-lg border border-[#DDD3C7] bg-white text-xs font-semibold text-[#5C534D] hover:bg-[#FAF8F5] transition-colors"
                                            >
                                                বাতিল
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* রিভিউ তালিকা */}
                        <div className="lg:col-span-7">
                            {loadingReviews ? (
                                <div className="flex items-center gap-2 text-sm text-[#8C7A6B] py-4">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#9E7B66]" />
                                    <span>রিভিউ লোড হচ্ছে...</span>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-[#DDD3C7] rounded-xl">
                                    <Star className="w-8 h-8 text-[#D9D1C7] mx-auto mb-2" />
                                    <p className="text-sm text-[#8C7A6B]">
                                        এখনও কোনো রিভিউ জমা দেওয়া হয়নি। প্রথম রিভিউটি আপনিই দিন!
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#E8E1D9] max-h-[560px] overflow-y-auto pr-2">
                                    {reviews.map((rev, idx) => {
                                        const u = getReviewUser(rev);
                                        const revId = rev._id || rev.id;

                                        return (
                                            <div key={revId || idx} className="py-4 space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        {u.image ? (
                                                            <img
                                                                src={u.image}
                                                                alt={u.name}
                                                                className="w-9 h-9 rounded-full object-cover border border-[#E8E1D9]"
                                                            />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-[#E8E1D9] flex items-center justify-center text-[#2C2724]">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-[#2C2724]">{u.name}</h4>
                                                            <span className="text-[11px] text-[#8C7A6B]">
                                                                {formatDate(rev.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    className={`w-4 h-4 ${s <= (Number(rev.rating) || 0)
                                                                        ? "fill-[#C89B3C] text-[#C89B3C]"
                                                                        : "text-[#E8E1D9]"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        {revId && (
                                                            <div className="flex items-center gap-1 border-l border-[#E8E1D9] pl-2.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStartEdit(rev)}
                                                                    className="p-1 rounded text-[#7C6E65] hover:text-[#2C2724] hover:bg-[#FAF8F5] transition-colors"
                                                                    title="এডিট করুন"
                                                                    aria-label="Edit review"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteReview(revId)}
                                                                    className="p-1 rounded text-[#7C6E65] hover:text-[#A8483B] hover:bg-red-50 transition-colors"
                                                                    title="ডিলিট করুন"
                                                                    aria-label="Delete review"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-[#5C534D] leading-relaxed pl-12">
                                                    {rev.comment}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}