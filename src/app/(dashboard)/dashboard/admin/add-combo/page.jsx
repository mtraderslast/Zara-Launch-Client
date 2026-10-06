"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X, ImagePlus, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import { createCombo } from "@/lib/action/combos";

export default function AddComboPage() {
    const [imageInput, setImageInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");

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
            title: "",
            slug: "",
            description: "",
            bannerImage: "",
            images: [],
            videoUrl: "",
            features: [],
            originalPrice: "",
            comboPrice: "",
            stock: 0,
            isActive: true,
            products: [{ title: "", quantity: 1, image: "", productId: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    const bannerImage = watch("bannerImage");
    const images = watch("images");
    const features = watch("features");

    const handleAddGalleryImage = () => {
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

    const handleRemoveGalleryImage = (index) => {
        setValue(
            "images",
            images.filter((_, i) => i !== index),
            { shouldValidate: true }
        );
    };

    const handleAddFeature = () => {
        const trimmed = featureInput.trim();
        if (!trimmed) return;
        if (!features.includes(trimmed)) {
            setValue("features", [...features, trimmed]);
        }
        setFeatureInput("");
    };

    const handleRemoveFeature = (index) => {
        setValue(
            "features",
            features.filter((_, i) => i !== index)
        );
    };

    const formatPayload = (data) => {
        const payload = {
            title: data.title.trim(),
            slug: data.slug.trim().toLowerCase(),
            description: data.description.trim(),
            bannerImage: data.bannerImage.trim(),
            images: data.images || [],
            videoUrl: data.videoUrl ? data.videoUrl.trim() : "",
            features: data.features || [],
            originalPrice: Number(data.originalPrice),
            comboPrice: Number(data.comboPrice),
            stock: Math.floor(Number(data.stock)) || 0,
            isActive: Boolean(data.isActive),
            products: data.products.map((item) => ({
                title: item.title.trim(),
                quantity: Math.max(1, Math.floor(Number(item.quantity)) || 1),
                image: item.image ? item.image.trim() : "",
                productId: item.productId?.trim() ? item.productId.trim() : null,
            })),
        };

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
            const response = await createCombo(payload);

            if (response?.success) {
                Swal.fire({
                    icon: "success",
                    title: "সাফল্য!",
                    text: response.message || "কম্বো প্যাকেজটি সফলভাবে তৈরি হয়েছে।",
                    confirmButtonColor: "#2C2724",
                });

                reset();
                setImageInput("");
                setFeatureInput("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ব্যর্থ হয়েছে",
                    text: response?.message || "কম্বো তৈরি করতে সমস্যা হয়েছে।",
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
                        নতুন কম্বো প্যাকেজ তৈরি করুন
                    </h1>
                    <p className="mt-2 text-sm text-[#70645C] font-normal">
                        আকর্ষণীয় অফারে একাধিক পণ্য যুক্ত করে কম্বো প্যাকেজ সাজান
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
                                    কম্বোর শিরোনাম *
                                </label>
                                <input
                                    type="text"
                                    {...register("title", { required: "কম্বোর শিরোনাম আবশ্যক" })}
                                    placeholder="যেমনঃ প্রিমিয়াম পারফিউম মেগা কম্বো"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.title && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.title.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্লাগ (SEO ফ্রেন্ডলি ইউআরএল) *
                                </label>
                                <input
                                    type="text"
                                    {...register("slug", { required: "স্লাগ আবশ্যক" })}
                                    placeholder="premium-perfume-mega-combo"
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
                                    ভিডিও লিংক (ঐচ্ছিক)
                                </label>
                                <input
                                    type="url"
                                    {...register("videoUrl")}
                                    placeholder="ইউটিউব বা ভিডিও এম্বেড লিংক (যেমন: https://youtube.com/watch?v=...)"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    কম্বোর বিবরণ *
                                </label>
                                <textarea
                                    rows={4}
                                    {...register("description", { required: "বিবরণ আবশ্যক" })}
                                    placeholder="কম্বো প্যাকেজের বিস্তারিত বিবরণ লিখুন..."
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all resize-none"
                                />
                                {errors.description && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* মূল্য ও স্টক */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            মূল্য ও স্টক ব্যবস্থাপনা
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    আসল মোট মূল্য *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("originalPrice", {
                                        required: "আসল মূল্য আবশ্যক",
                                        min: { value: 0, message: "মূল্য ঋণাত্মক হতে পারবে না" },
                                    })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.originalPrice && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.originalPrice.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    কম্বো অফার মূল্য *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("comboPrice", {
                                        required: "অফার মূল্য আবশ্যক",
                                        min: { value: 0, message: "মূল্য ঋণাত্মক হতে পারবে না" },
                                    })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.comboPrice && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.comboPrice.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্টক সংখ্যা *
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    {...register("stock", {
                                        required: "স্টক আবশ্যক",
                                        min: { value: 0, message: "স্টক ঋণাত্মক হতে পারবে না" },
                                    })}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.stock && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.stock.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center pt-6 space-x-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    {...register("isActive")}
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#2C2724] accent-[#2C2724] focus:ring-0 cursor-pointer"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="text-sm font-medium text-[#2C2724] cursor-pointer select-none"
                                >
                                    প্যাকেজটি সক্রিয় রাখুন
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* ব্যানার ও গ্যালারি ছবি */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            ছবি ও ব্যানার
                        </h2>
                        <div className="space-y-6">
                            {/* প্রধান ব্যানার */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    প্রধান ব্যানার ছবি (URL) *
                                </label>
                                <input
                                    type="url"
                                    {...register("bannerImage", {
                                        required: "ব্যানার ছবির লিংক আবশ্যক",
                                    })}
                                    placeholder="https://example.com/banner.jpg"
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                {errors.bannerImage && (
                                    <span className="text-xs text-[#A8483B] mt-1.5 block">
                                        {errors.bannerImage.message}
                                    </span>
                                )}
                                {bannerImage && (
                                    <div className="mt-3 relative w-full max-w-sm h-40 rounded-lg overflow-hidden border border-[#E8E1D9] bg-[#FAF8F5]">
                                        <img
                                            src={bannerImage}
                                            alt="Banner Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* গ্যালারি ছবি */}
                            <div className="pt-4 border-t border-[#E8E1D9]">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    অতিরিক্ত গ্যালারি ছবি (ঐচ্ছিক)
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        placeholder="ছবির লিংক দিন (যেমন: https://example.com/gallery1.jpg)"
                                        className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddGalleryImage}
                                        className="px-5 py-3 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#2C2724] rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-[#E8E1D9]"
                                    >
                                        <ImagePlus className="w-4 h-4 text-[#9E7B66]" />
                                        যোগ করুন
                                    </button>
                                </div>

                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4">
                                        {images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="relative group aspect-square rounded-lg border border-[#E8E1D9] bg-[#FAF8F5] overflow-hidden"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Gallery Image ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGalleryImage(idx)}
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
                        </div>
                    </section>

                    {/* কম্বোর বৈশিষ্ট্যসমূহ */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <h2 className="text-base font-semibold text-[#2C2724] pb-4 mb-6 border-b border-[#E8E1D9]">
                            প্যাকেজের প্রধান বৈশিষ্ট্যসমূহ (Features)
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddFeature();
                                        }
                                    }}
                                    placeholder="একটি বৈশিষ্ট্য লিখুন (যেমন: ফ্রি হোম ডেলিভারি)"
                                    className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66] focus:ring-1 focus:ring-[#9E7B66] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="px-5 py-3 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#2C2724] rounded-lg text-sm font-medium transition-colors border border-[#E8E1D9] flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-[#9E7B66]" />
                                    যোগ করুন
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {features.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4ECE4] text-[#2C2724] border border-[#E8E1D9] rounded-full text-xs font-medium"
                                    >
                                        ✓ {item}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(idx)}
                                            className="text-[#70645C] hover:text-[#A8483B] transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* অন্তর্ভুক্ত পণ্যসমূহ (Included Products) */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E1D9]">
                            <div>
                                <h2 className="text-base font-semibold text-[#2C2724]">
                                    কম্বোতে অন্তর্ভুক্ত পণ্যসমূহ *
                                </h2>
                                <p className="text-xs text-[#70645C] mt-0.5">
                                    এই প্যাকেজের সাথে ক্রেতা যেসব আইটেম বা প্রোডাক্ট পাবেন
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg relative space-y-4 shadow-sm"
                                >
                                    <div className="flex justify-between items-center pb-2 border-b border-[#E8E1D9]">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B66]">
                                            পণ্য #{index + 1}
                                        </span>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-[#A8483B] hover:text-[#C55043] transition-colors p-1"
                                                title="পণ্য মুছুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                পণ্যের নাম *
                                            </label>
                                            <input
                                                type="text"
                                                {...register(`products.${index}.title`, {
                                                    required: "পণ্যের নাম আবশ্যক",
                                                })}
                                                placeholder="যেমন: Oud Wood 50ml"
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                পরিমাণ *
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                {...register(`products.${index}.quantity`, {
                                                    required: true,
                                                    min: 1,
                                                })}
                                                placeholder="1"
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                প্রোডাক্ট আইডি (ঐচ্ছিক)
                                            </label>
                                            <input
                                                type="text"
                                                {...register(`products.${index}.productId`)}
                                                placeholder="MongoDB ObjectId"
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                                            />
                                        </div>

                                        <div className="md:col-span-4">
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                পণ্যের ছবির URL (ঐচ্ছিক)
                                            </label>
                                            <input
                                                type="url"
                                                {...register(`products.${index}.image`)}
                                                placeholder="https://example.com/item.jpg"
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] placeholder-[#8C7A6B]/50 focus:outline-none focus:border-[#9E7B66]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        title: "",
                                        quantity: 1,
                                        image: "",
                                        productId: "",
                                    })
                                }
                                className="w-full py-3.5 border border-dashed border-[#9E7B66] rounded-lg text-xs uppercase tracking-widest font-semibold text-[#70645C] hover:bg-[#F4ECE4] hover:text-[#2C2724] transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> আরও পণ্য যোগ করুন
                            </button>
                        </div>
                    </section>

                    {/* সাবমিট বাটন */}
                    <div className="flex justify-end items-center pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-3.5 bg-[#2C2724] hover:bg-[#2C2724]/90 active:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50"
                        >
                            কম্বো সংরক্ষণ করুন
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}