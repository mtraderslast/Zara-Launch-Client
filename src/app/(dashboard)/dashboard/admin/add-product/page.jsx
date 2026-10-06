"use client";

import React, { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X, ImagePlus, Tag } from "lucide-react";
import Swal from "sweetalert2";
import { createProduct } from "@/lib/action/products";

// ক্যাটাগরি ও সাব-ক্যাটাগরি কনফিগারেশন
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
                    কোনো কাস্টম বৈশিষ্ট্য যোগ করা হয়নি। প্রয়োজনে &ldquo;বৈশিষ্ট্য যোগ করুন&rdquo; এ ক্লিক করুন।
                </p>
            ) : (
                <div className="space-y-2">
                    {fields.map((item, k) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <input
                                type="text"
                                {...register(`variants.${nestIndex}.attributeList.${k}.key`)}
                                placeholder="নাম - ইংরেজিতে (যেমন: Color, Size, Volume)"
                                className="w-1/2 px-3 py-2 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                            />
                            <input
                                type="text"
                                {...register(`variants.${nestIndex}.attributeList.${k}.value`)}
                                placeholder="মান (যেমন: Black, 52, 54, 100ml)"
                                className="w-1/2 px-3 py-2 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                            />
                            <button
                                type="button"
                                onClick={() => remove(k)}
                                className="p-1.5 text-[#70645C] hover:text-[#A8483B] hover:bg-[#FAF8F5] rounded transition-colors"
                                title="বৈশিষ্ট্য মুছুন"
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

export default function AddProductPage() {
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

    // নির্বাচিত ক্যাটাগরি অনুযায়ী সাব-ক্যাটাগরির তালিকা তৈরি
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
            title: "প্রসেসিং হচ্ছে...",
            text: "দয়া করে অপেক্ষা করুন",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const payload = formatPayload(data);
            const response = await createProduct(payload);

            if (response?.success) {
                Swal.fire({
                    icon: "success",
                    title: "সাফল্য!",
                    text: response.message || "প্রোডাক্টটি সফলভাবে তৈরি করা হয়েছে।",
                    confirmButtonColor: "#2C2724",
                });

                reset();
                setImageInput("");
                setTagInput("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ব্যর্থ হয়েছে",
                    text: response?.message || "প্রোডাক্ট যোগ করতে সমস্যা হয়েছে।",
                    confirmButtonColor: "#A8483B",
                });
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "সার্ভারে সমস্যা দেখা দিয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।";

            Swal.fire({
                icon: "error",
                title: "ত্রুটি!",
                text: errorMessage,
                confirmButtonColor: "#A8483B",
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#2C2724] p-4 font-sans selection:bg-[#E0C9A6]">
            <div className="mx-auto">
                <header className="mb-5 pb-6 border-b border-[#E8E1D9]">
                    <h1 className="text-2xl sm:text-3xl font-medium tracking-wide text-[#2C2724]">
                        নতুন পণ্য যোগ করুন
                    </h1>
                    <p className="mt-2 text-sm text-[#70645C] font-normal">
                        আপনার ই-কমার্স স্টোরের পণ্যের বিবরণ, ছবি এবং ভ্যারিয়েন্ট যুক্ত করুন
                    </p>
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
                                    পণ্যের নাম (বাংলায় লিখুন) *
                                </label>
                                <input
                                    type="text"
                                    {...register("titleBn", { required: "বাংলা নাম আবশ্যক" })}
                                    placeholder="বাংলায় লিখুন (যেমনঃ প্রিমিয়াম দুবাই চেরি বোরকা)"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.titleBn && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.titleBn.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    পণ্যের নাম (ইংরেজি - English Only) *
                                </label>
                                <input
                                    type="text"
                                    {...register("titleEn", { required: "ইংরেজি নাম আবশ্যক" })}
                                    placeholder="Write in English (e.g. Premium Dubai Cherry Burqa)"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.titleEn && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.titleEn.message}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্লাগ (SEO ফ্রেন্ডলি ইউআরএল - ইংরেজিতে লিখুন) *
                                </label>
                                <input
                                    type="text"
                                    {...register("slug", { required: "স্লাগ আবশ্যক" })}
                                    placeholder="ইংরেজিতে ছোট হাতের অক্ষরে লিখুন (e.g. premium-dubai-cherry-burqa)"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all lowercase"
                                />
                                {errors.slug && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.slug.message}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    পণ্যের বিবরণ (বাংলায় লিখুন) *
                                </label>
                                <textarea
                                    rows={4}
                                    {...register("descriptionBn", { required: "বাংলা বিবরণ আবশ্যক" })}
                                    placeholder="বাংলায় পণ্যের বিস্তারিত ও সঠিক বিবরণ লিখুন..."
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all resize-none"
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
                            {/* মূল ক্যাটাগরি ড্রপডাউন */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    মূল ক্যাটেগরি নির্বাচন করুন *
                                </label>
                                <select
                                    {...register("category", { required: "ক্যাটেগরি নির্বাচন আবশ্যক" })}
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all cursor-pointer"
                                >
                                    <option value="">-- ক্যাটাগরি বেছে নিন --</option>
                                    {categoryConfig.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.labelBn}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.category.message}
                                    </span>
                                )}
                            </div>

                            {/* সাব-ক্যাটেগরি ড্রপডাউন */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    সাব-ক্যাটেগরি নির্বাচন করুন (ঐচ্ছিক)
                                </label>
                                <select
                                    {...register("subCategory")}
                                    disabled={!selectedCategory}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">-- সাব-ক্যাটাগরি বেছে নিন --</option>
                                    {availableSubCategories.map((sub) => (
                                        <option key={sub.value} value={sub.value}>
                                            {sub.labelBn}
                                        </option>
                                    ))}
                                </select>
                                {!selectedCategory && (
                                    <span className="text-[11px] text-[#8C7A6B] mt-1 block">
                                        প্রথমে মূল ক্যাটাগরি নির্বাচন করুন
                                    </span>
                                )}
                            </div>

                            {/* ব্র্যান্ড */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    ব্র্যান্ড (ইংরেজি বা বাংলায় - ঐচ্ছিক)
                                </label>
                                <input
                                    type="text"
                                    {...register("brand")}
                                    placeholder="যেমনঃ Al-Haramain বা Zara"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
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
                                    মূল্য (টাকা - সংখ্যায়) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price", {
                                        required: "মূল্য আবশ্যক",
                                        min: { value: 0, message: "মূল্য ঋণাত্মক হতে পারবে না" },
                                    })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.price && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.price.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    ডিসকাউন্ট (% - শতকরা হার)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="100"
                                    {...register("discountRate", {
                                        min: { value: 0, message: "ডিসকাউন্ট ঋণাত্মক হতে পারবে না" },
                                        max: { value: 100, message: "ডিসকাউন্ট ১০০-এর বেশি হতে পারবে না" },
                                    })}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.discountRate && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.discountRate.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্ট্যাটাস
                                </label>
                                <select
                                    {...register("status")}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all cursor-pointer"
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
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#2C2724] accent-[#2C2724] focus:ring-0 cursor-pointer"
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

                    {/* পণ্যের ছবি */}
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
                                    placeholder="ছবির সরাসরি লিংক দিন (যেমন: https://example.com/item.jpg)"
                                    className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
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

                            <input
                                type="hidden"
                                {...register("images", {
                                    validate: (v) =>
                                        (Array.isArray(v) && v.length > 0) || "অন্তত একটি পণ্যের ছবি দেওয়া আবশ্যক",
                                })}
                            />

                            {errors.images && (
                                <span className="text-xs text-[#A8483B] block">
                                    {errors.images.message}
                                </span>
                            )}

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
                                                title="ছবি মুছুন"
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
                                    placeholder="ট্যাগ ইংরেজি বা বাংলায় লিখুন (যেমন: burqa, abaya, কালো বোরকা) এবং এন্টার চাপুন"
                                    className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-5 py-3 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#2C2724] rounded-lg text-sm font-medium transition-colors border border-[#E8E1D9] flex items-center gap-1.5"
                                >
                                    <Tag className="w-3.5 h-3.5 text-[#9E7B66]" />
                                    যোগ করুন
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

                    {/* পণ্যের ভ্যারিয়েন্ট */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E1D9]">
                            <div>
                                <h2 className="text-base font-semibold text-[#2C2724]">
                                    পণ্যের ভ্যারিয়েন্ট
                                </h2>
                                <p className="text-xs text-[#70645C] mt-0.5">
                                    ভিন্ন সাইজ, রঙ, ভলিউম অথবা নির্দিষ্ট স্টক ও দাম কনফিগার করুন
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasVariants"
                                    {...register("hasVariants")}
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#2C2724] accent-[#2C2724] focus:ring-0 cursor-pointer"
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
                                                title="ভ্যারিয়েন্ট মুছুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                    এসকেইউ (SKU - ইংরেজিতে লিখুন, ঐচ্ছিক)
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(`variants.${index}.sku`)}
                                                    placeholder="e.g. SKU-BURQA-52"
                                                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                    ভ্যারিয়েন্টের মূল্য (সংখ্যায়, ঐচ্ছিক)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`variants.${index}.price`, {
                                                        min: { value: 0, message: "মূল্য ঋণাত্মক হতে পারবে না" },
                                                    })}
                                                    placeholder="খালি রাখলে মূল মূল্য প্রযোজ্য হবে"
                                                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                    স্টক সংখ্যা (সংখ্যায়) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="1"
                                                    {...register(`variants.${index}.stock`, {
                                                        min: { value: 0, message: "স্টক ঋণাত্মক হতে পারবে না" },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
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
                    <div className="flex justify-end items-center pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-3.5 bg-[#2C2724] hover:bg-[#2C2724]/90 active:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50"
                        >
                            পণ্য সংরক্ষণ করুন
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}