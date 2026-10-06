"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X, ImagePlus, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { fetchProductById, updateProduct } from "@/lib/action/products";

const categoryConfig = [
    {
        labelBn: "পোশাক (Clothing)",
        value: "Clothing",
        subCategories: [
            { labelBn: "বোরকা (Burqa)", value: "Burqa" },
            { labelBn: "হিজাব (Hijab)", value: "Hijab" },
            { labelBn: "আবায়া (Abaya)", value: "Abaya" },
        ],
    },
    {
        labelBn: "সুগন্ধি (Fragrance)",
        value: "Fragrance",
        subCategories: [
            { labelBn: "বডি স্প্রে (Body Spray)", value: "Body Spray" },
            { labelBn: "পারফিউম (Perfume)", value: "Perfume" },
        ],
    },
];

function VariantAttributesField({ nestIndex, control, register }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${nestIndex}.attributeList`,
    });

    return (
        <div className="mt-4 pt-3 border-t border-[#E8E1D9]">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#70645C]">
                        বৈশিষ্ট্যসমূহ (Dynamic Attributes)
                    </span>
                    <p className="text-[11px] text-[#8C7A6B]">
                        যেমন: সাইজ, রঙ, ভলিউম (Volume), ওজন (Weight) ইত্যাদি
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => append({ key: "", value: "" })}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E7B66] hover:text-[#2C2724] transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    বৈশিষ্ট্য যোগ করুন
                </button>
            </div>

            {fields.length === 0 ? (
                <p className="text-xs italic text-[#8C7A6B] bg-[#FAF8F5] p-3 rounded-lg border border-dashed border-[#E8E1D9]">
                    কোনো কাস্টম বৈশিষ্ট্য যোগ করা হয়নি।
                </p>
            ) : (
                <div className="space-y-2">
                    {fields.map((item, k) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <input
                                type="text"
                                {...register(`variants.${nestIndex}.attributeList.${k}.key`)}
                                placeholder="নাম (যেমন: Color, Size)"
                                className="w-1/2 px-3 py-2 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                            />
                            <input
                                type="text"
                                {...register(`variants.${nestIndex}.attributeList.${k}.value`)}
                                placeholder="মান (যেমন: Black, 52, 100ml)"
                                className="w-1/2 px-3 py-2 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                            />
                            <button
                                type="button"
                                onClick={() => remove(k)}
                                className="p-1.5 text-[#70645C] hover:text-[#A8483B] hover:bg-[#FAF8F5] rounded transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [imageInput, setImageInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            titleBn: "",
            titleEn: "",
            slug: "",
            descriptionBn: "",
            category: "",
            subCategory: "",
            brand: "",
            price: "",
            discountRate: 0,
            images: [],
            isFeatured: false,
            status: "active",
            tags: [],
            hasVariants: false,
            variants: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const selectedCategory = watch("category");
    const images = watch("images");
    const tags = watch("tags");
    const hasVariants = watch("hasVariants");

    // ডাটাবেজ থেকে ডাটা লোড করে ফর্মে বসানো
    useEffect(() => {
        const fetchCurrentProduct = async () => {
            setLoading(true);
            try {
                const response = await fetchProductById(id);
                if (response?.success && response.data) {
                    const prod = response.data;

                    // ডাটাবেজের `attributes` অবজেক্টকে ফর্মে ব্যবহারের উপযোগী `attributeList` অ্যারেতে রূপান্তর
                    const formattedVariants = (prod.variants || []).map((v) => {
                        const attrObj = v.attributes || {};
                        const attributeList = Object.entries(attrObj).map(([key, value]) => ({
                            key,
                            value,
                        }));

                        return {
                            sku: v.sku || "",
                            price: v.price ?? "",
                            stock: v.stock ?? 0,
                            attributeList: attributeList.length > 0 ? attributeList : [{ key: "", value: "" }],
                        };
                    });

                    reset({
                        titleBn: prod.titleBn || "",
                        titleEn: prod.titleEn || "",
                        slug: prod.slug || "",
                        descriptionBn: prod.descriptionBn || "",
                        category: prod.category || "",
                        subCategory: prod.subCategory || "",
                        brand: prod.brand || "",
                        price: prod.price ?? "",
                        discountRate: prod.discountRate ?? 0,
                        images: prod.images || [],
                        isFeatured: Boolean(prod.isFeatured),
                        status: prod.status || "active",
                        tags: prod.tags || [],
                        hasVariants: Boolean(prod.hasVariants),
                        variants: formattedVariants,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "পণ্য পাওয়া যায়নি",
                        text: "এই পণ্যটির তথ্য পাওয়া যায়নি।",
                        confirmButtonColor: "#2C2724",
                    }).then(() => router.push("/admin/products"));
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "ত্রুটি",
                    text: error?.message || "ডাটা লোড করতে সমস্যা হয়েছে",
                    confirmButtonColor: "#2C2724",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCurrentProduct();
        }
    }, [id, reset, router]);

    const availableSubCategories = useMemo(() => {
        const found = categoryConfig.find((c) => c.value === selectedCategory);
        return found ? found.subCategories : [];
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        setValue("category", e.target.value, { shouldValidate: true });
        setValue("subCategory", "");
    };

    const handleAddImage = () => {
        const trimmed = imageInput.trim();
        if (!trimmed) return;
        try {
            new URL(trimmed);
            setValue("images", [...images, trimmed], { shouldValidate: true });
            setImageInput("");
        } catch {
            Swal.fire({
                icon: "warning",
                title: "ভুল ইউআরএল",
                text: "অনুগ্রহ করে একটি বৈধ ছবির ইউআরএল (URL) প্রদান করুন।",
            });
        }
    };

    const handleRemoveImage = (index) => {
        setValue("images", images.filter((_, i) => i !== index), { shouldValidate: true });
    };

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed) return;
        if (!tags.includes(trimmed)) {
            setValue("tags", [...tags, trimmed]);
        }
        setTagInput("");
    };

    const handleRemoveTag = (index) => {
        setValue("tags", tags.filter((_, i) => i !== index));
    };

    const formatPayload = (data) => {
        const payload = {
            titleBn: data.titleBn.trim(),
            titleEn: data.titleEn.trim(),
            slug: data.slug.trim().toLowerCase(),
            descriptionBn: data.descriptionBn.trim(),
            category: data.category.trim(),
            price: Number(data.price),
            discountRate: Number(data.discountRate) || 0,
            images: data.images,
            isFeatured: Boolean(data.isFeatured),
            status: data.status || "active",
            tags: data.tags || [],
            hasVariants: Boolean(data.hasVariants),
            variants: [],
        };

        if (data.subCategory?.trim()) payload.subCategory = data.subCategory.trim();
        if (data.brand?.trim()) payload.brand = data.brand.trim();

        if (payload.hasVariants && Array.isArray(data.variants) && data.variants.length > 0) {
            payload.variants = data.variants.map((v) => {
                const attributes = (v.attributeList || []).reduce((acc, curr) => {
                    const key = curr.key?.trim();
                    const val = curr.value?.trim();
                    if (key && val) acc[key] = val;
                    return acc;
                }, {});

                const variant = {
                    attributes,
                    stock: Math.floor(Number(v.stock)) || 0,
                };

                if (v.sku?.trim()) variant.sku = v.sku.trim();
                if (v.price !== "" && v.price !== null && v.price !== undefined) {
                    variant.price = Number(v.price);
                }

                return variant;
            });
        }

        return payload;
    };

    const onSubmit = async (data) => {
        Swal.fire({
            title: "আপডেট হচ্ছে...",
            text: "অনুগ্রহ করে অপেক্ষা করুন",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const payload = formatPayload(data);
            const response = await updateProduct(id, payload);

            if (response?.success) {
                Swal.fire({
                    icon: "success",
                    title: "আপডেট সফল!",
                    text: response.message || "পণ্যটির তথ্য সফলভাবে আপডেট করা হয়েছে।",
                    confirmButtonColor: "#2C2724",
                }).then(() => {
                    router.push("/dashboard/admin/manage-products");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ব্যর্থ হয়েছে",
                    text: response?.message || "আপডেট সম্পন্ন করা যায়নি।",
                    confirmButtonColor: "#A8483B",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "ত্রুটি!",
                text: error?.response?.data?.message || error?.message || "সার্ভার এরর",
                confirmButtonColor: "#A8483B",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#9E7B66] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-[#70645C]">পণ্যের তথ্য লোড করা হচ্ছে...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#2C2724] p-4 font-sans selection:bg-[#E0C9A6]">
            <div className="mx-auto">
                <header className="mb-5 pb-6 border-b border-[#E8E1D9] flex items-center justify-between">
                    <div>
                        <Link
                            href="/dashboard/admin/manage-products"
                            className="inline-flex items-center gap-1 text-xs text-[#70645C] hover:text-[#2C2724] mb-2 font-medium"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> পণ্য তালিকায় ফিরে যান
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-medium tracking-wide text-[#2C2724]">
                            পণ্য সম্পাদনা করুন (Edit Product)
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#70645C]">
                            তথ্য পরিবর্তন করে নিচে সংরক্ষণ বাটনে চাপুন
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* মৌলিক তথ্য */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            মৌলিক তথ্য
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    পণ্যের নাম (বাংলায়) *
                                </label>
                                <input
                                    type="text"
                                    {...register("titleBn", { required: "বাংলা নাম আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                                {errors.titleBn && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.titleBn.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    পণ্যের নাম (ইংরেজি) *
                                </label>
                                <input
                                    type="text"
                                    {...register("titleEn", { required: "ইংরেজি নাম আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                                {errors.titleEn && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.titleEn.message}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্লাগ (SEO ফ্রেন্ডলি ইউআরএল) *
                                </label>
                                <input
                                    type="text"
                                    {...register("slug", { required: "স্লাগ আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] lowercase"
                                />
                                {errors.slug && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.slug.message}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    পণ্যের বিবরণ (বাংলায়) *
                                </label>
                                <textarea
                                    rows={4}
                                    {...register("descriptionBn", { required: "বাংলা বিবরণ আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] resize-none"
                                />
                                {errors.descriptionBn && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.descriptionBn.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* শ্রেণিবিভাগ ও ব্র্যান্ড */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            শ্রেণিবিভাগ ও ব্র্যান্ড
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    মূল ক্যাটেগরি *
                                </label>
                                <select
                                    {...register("category", { required: "ক্যাটেগরি নির্বাচন আবশ্যক" })}
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] cursor-pointer"
                                >
                                    <option value="">-- ক্যাটাগরি বেছে নিন --</option>
                                    {categoryConfig.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.labelBn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    সাব-ক্যাটেগরি (ঐচ্ছিক)
                                </label>
                                <select
                                    {...register("subCategory")}
                                    disabled={!selectedCategory}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">-- সাব-ক্যাটাগরি বেছে নিন --</option>
                                    {availableSubCategories.map((sub) => (
                                        <option key={sub.value} value={sub.value}>
                                            {sub.labelBn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    ব্র্যান্ড (ঐচ্ছিক)
                                </label>
                                <input
                                    type="text"
                                    {...register("brand")}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>
                        </div>
                    </section>

                    {/* মূল্য ও স্থিতি */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            মূল্য ও স্থিতি
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    মূল্য (টাকা) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price", { required: "মূল্য আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    ডিসকাউন্ট (%)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="100"
                                    {...register("discountRate")}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্ট্যাটাস
                                </label>
                                <select
                                    {...register("status")}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] cursor-pointer"
                                >
                                    <option value="active">সক্রিয় (Active)</option>
                                    <option value="draft">ড্রাফট (Draft)</option>
                                </select>
                            </div>

                            <div className="flex items-center pt-6 space-x-3">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    {...register("isFeatured")}
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#2C2724] accent-[#2C2724] cursor-pointer"
                                />
                                <label
                                    htmlFor="isFeatured"
                                    className="text-sm font-medium text-[#2C2724] cursor-pointer select-none"
                                >
                                    ফিচার্ড পণ্য হিসেবে প্রদর্শন করুন
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* ছবি ব্যবস্থাপনা */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            পণ্যের ছবি *
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="url"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    placeholder="নতুন ছবির সরাসরি লিংক যোগ করুন..."
                                    className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-5 py-3 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#2C2724] rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-[#E8E1D9]"
                                >
                                    <ImagePlus className="w-4 h-4 text-[#9E7B66]" />
                                    যোগ করুন
                                </button>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group aspect-square rounded-lg border border-[#E8E1D9] bg-[#FAF8F5] overflow-hidden"
                                        >
                                            <img
                                                src={img}
                                                alt={`Product Image ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-[#A8483B] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ট্যাগ */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            ট্যাগ (Search Tags)
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    placeholder="নতুন ট্যাগ লিখে এন্টার চাপুন..."
                                    className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-5 py-3 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#2C2724] rounded-lg text-sm font-medium transition-colors border border-[#E8E1D9] flex items-center gap-1.5"
                                >
                                    <Tag className="w-3.5 h-3.5 text-[#9E7B66]" /> যোগ করুন
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4ECE4] text-[#2C2724] border border-[#E8E1D9] rounded-full text-xs font-medium"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(idx)}
                                            className="text-[#70645C] hover:text-[#A8483B] transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ভ্যারিয়েন্ট */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E1D9]">
                            <div>
                                <h2 className="text-base font-semibold text-[#2C2724]">
                                    পণ্যের ভ্যারিয়েন্ট
                                </h2>
                                <p className="text-xs text-[#70645C] mt-0.5">
                                    ভ্যারিয়েন্টের স্টক বা দামের পরিবর্তন করুন
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasVariants"
                                    {...register("hasVariants")}
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#2C2724] accent-[#2C2724] cursor-pointer"
                                />
                                <label
                                    htmlFor="hasVariants"
                                    className="text-xs font-semibold uppercase tracking-wider text-[#2C2724] cursor-pointer select-none"
                                >
                                    ভ্যারিয়েন্ট সক্রিয় করুন
                                </label>
                            </div>
                        </div>

                        {hasVariants && (
                            <div className="space-y-6">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="p-5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg relative space-y-4 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center pb-2 border-b border-[#E8E1D9]">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B66]">
                                                ভ্যারিয়েন্ট #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-[#A8483B] hover:text-[#C55043] transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                    এসকেইউ (SKU)
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(`variants.${index}.sku`)}
                                                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                    ভ্যারিয়েন্টের মূল্য
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`variants.${index}.price`)}
                                                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                    স্টক সংখ্যা *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="1"
                                                    {...register(`variants.${index}.stock`)}
                                                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                                />
                                            </div>
                                        </div>

                                        <VariantAttributesField
                                            nestIndex={index}
                                            control={control}
                                            register={register}
                                        />
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            sku: "",
                                            price: "",
                                            stock: 0,
                                            attributeList: [{ key: "", value: "" }],
                                        })
                                    }
                                    className="w-full py-3.5 border border-dashed border-[#9E7B66] rounded-lg text-xs uppercase tracking-widest font-semibold text-[#70645C] hover:bg-[#F4ECE4] hover:text-[#2C2724] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> নতুন ভ্যারিয়েন্ট যোগ করুন
                                </button>
                            </div>
                        )}
                    </section>

                    {/* সাবমিট বাটন */}
                    <div className="flex justify-end items-center gap-4 pt-4">
                        <Link
                            href="/admin/products"
                            className="px-6 py-3.5 border border-[#E8E1D9] bg-white text-[#70645C] hover:text-[#2C2724] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all"
                        >
                            বাতিল করুন
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-3.5 bg-[#2C2724] hover:bg-[#2C2724]/90 active:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50"
                        >
                            আপডেট সংরক্ষণ করুন
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}