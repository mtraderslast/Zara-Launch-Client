"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X, ImagePlus, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { fetchComboById, updateCombo } from "@/lib/action/combos";

export default function EditComboPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
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

    // পূর্বের ডাটা লোড করে ফর্ম ফিল্ডে সেট করা
    useEffect(() => {
        const loadComboData = async () => {
            setLoading(true);
            try {
                const response = await fetchComboById(id);
                if (response?.success && response.data) {
                    const combo = response.data;

                    reset({
                        title: combo.title || "",
                        slug: combo.slug || "",
                        description: combo.description || "",
                        bannerImage: combo.bannerImage || "",
                        images: combo.images || [],
                        videoUrl: combo.videoUrl || "",
                        features: combo.features || [],
                        originalPrice: combo.originalPrice ?? "",
                        comboPrice: combo.comboPrice ?? "",
                        stock: combo.stock ?? 0,
                        isActive: Boolean(combo.isActive),
                        products: (combo.products || []).map((item) => ({
                            title: item.title || "",
                            quantity: item.quantity || 1,
                            image: item.image || "",
                            productId: item.productId?._id ? item.productId._id : (item.productId || ""),
                        })),
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "প্যাকেজ পাওয়া যায়নি",
                        text: "এই কম্বো প্যাকেজের কোনো তথ্য পাওয়া যায়নি।",
                        confirmButtonColor: "#2C2724",
                    }).then(() => router.push("/admin/combos"));
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
            loadComboData();
        }
    }, [id, reset, router]);

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
        return {
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
    };

    const onSubmit = async (data) => {
        Swal.fire({
            title: "আপডেট হচ্ছে...",
            text: "দয়া করে অপেক্ষা করুন",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const payload = formatPayload(data);
            const response = await updateCombo(id, payload);

            if (response?.success) {
                Swal.fire({
                    icon: "success",
                    title: "আপডেট সফল!",
                    text: response.message || "কম্বো প্যাকেজটি সফলভাবে আপডেট করা হয়েছে।",
                    confirmButtonColor: "#2C2724",
                }).then(() => {
                    router.push("/dashboard/admin/manage-combos");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ব্যর্থ হয়েছে",
                    text: response?.message || "কম্বো আপডেট করতে সমস্যা হয়েছে।",
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#9E7B66] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-[#70645C]">কম্বো তথ্য লোড হচ্ছে...</span>
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
                            href="/dashboard/admin/manage-combos"
                            className="inline-flex items-center gap-1 text-xs text-[#70645C] hover:text-[#2C2724] mb-2 font-medium"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> কম্বো তালিকায় ফিরে যান
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-medium tracking-wide text-[#2C2724]">
                            কম্বো প্যাকেজ সম্পাদনা করুন (Edit Combo)
                        </h1>
                        <p className="mt-1 text-sm text-[#70645C]">
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
                                    কম্বোর শিরোনাম *
                                </label>
                                <input
                                    type="text"
                                    {...register("title", { required: "কম্বোর শিরোনাম আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
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
                                    ভিডিও লিংক (ঐচ্ছিক)
                                </label>
                                <input
                                    type="url"
                                    {...register("videoUrl")}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    কম্বোর বিবরণ *
                                </label>
                                <textarea
                                    rows={4}
                                    {...register("description", { required: "বিবরণ আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66] resize-none"
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
                                    {...register("originalPrice", { required: "আসল মূল্য আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    কম্বো অফার মূল্য *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("comboPrice", { required: "অফার মূল্য আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    স্টক সংখ্যা *
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    {...register("stock", { required: "স্টক আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                            </div>

                            <div className="flex items-center pt-6 space-x-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    {...register("isActive")}
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#2C2724] accent-[#2C2724] cursor-pointer"
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
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    প্রধান ব্যানার ছবি (URL) *
                                </label>
                                <input
                                    type="url"
                                    {...register("bannerImage", { required: "ব্যানার ছবির লিংক আবশ্যক" })}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
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

                            <div className="pt-4 border-t border-[#E8E1D9]">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-2">
                                    অতিরিক্ত গ্যালারি ছবি (ঐচ্ছিক)
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        placeholder="ছবির লিংক দিন..."
                                        className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
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

                    {/* বৈশিষ্ট্যসমূহ */}
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
                                    placeholder="একটি বৈশিষ্ট্য লিখে এন্টার চাপুন..."
                                    className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg text-sm text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="px-5 py-3 bg-[#F4ECE4] hover:bg-[#EFE8DF] text-[#2C2724] rounded-lg text-sm font-medium transition-colors border border-[#E8E1D9] flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-[#9E7B66]" /> যোগ করুন
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
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* অন্তর্ভুক্ত পণ্যসমূহ */}
                    <section className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E1D9] shadow-sm">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E1D9]">
                            <div>
                                <h2 className="text-base font-semibold text-[#2C2724]">
                                    কম্বোতে অন্তর্ভুক্ত পণ্যসমূহ *
                                </h2>
                                <p className="text-xs text-[#70645C] mt-0.5">
                                    এই প্যাকেজের সাথে ক্রেতা যেসব পণ্য পাবেন
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
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
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
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                প্রোডাক্ট আইডি (ঐচ্ছিক)
                                            </label>
                                            <input
                                                type="text"
                                                {...register(`products.${index}.productId`)}
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                                            />
                                        </div>

                                        <div className="md:col-span-4">
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70645C] mb-1.5">
                                                পণ্যের ছবির URL (ঐচ্ছিক)
                                            </label>
                                            <input
                                                type="url"
                                                {...register(`products.${index}.image`)}
                                                className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-[#E8E1D9] rounded-md text-xs text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
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
                    <div className="flex justify-end items-center gap-4 pt-4">
                        <Link
                            href="/admin/combos"
                            className="px-6 py-3.5 border border-[#E8E1D9] bg-white text-[#70645C] hover:text-[#2C2724] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all"
                        >
                            বাতিল করুন
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-3.5 bg-[#2C2724] hover:bg-[#2C2724]/90 active:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50"
                        >
                            কম্বো আপডেট সংরক্ষণ করুন
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}