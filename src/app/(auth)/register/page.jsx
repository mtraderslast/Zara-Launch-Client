"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Crown } from "lucide-react";
import { FaHome } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

function RegisterContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const password = watch("password");

    const onRegisterSubmit = async (userData) => {
        const { data, error } = await authClient.signUp.email({
            name: userData.name,
            email: userData.email,
            password: userData.password,
        });

        if (error) {
            Swal.fire({
                icon: "error",
                title: "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
                text: error.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                confirmButtonColor: "#c59b27",
            });
            reset();
        } else {
            Swal.fire({
                icon: "success",
                title: "অভিনন্দন!",
                text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
                confirmButtonColor: "#c59b27",
            }).then(() => {
                router.push("/");
            });
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] text-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#d4af37] selection:text-white font-sans">

            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#f3e5ab]/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Return Home Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-amber-900 border border-amber-200 hover:border-amber-400 rounded-full backdrop-blur-md transition-all text-xs font-semibold tracking-wide shadow-sm hover:shadow group"
            >
                <FaHome className="group-hover:-translate-x-0.5 transition-transform text-[#c59b27]" />
                <span>হোমে ফিরে যান</span>
            </Link>

            {/* Main Luxury Light Auth Card */}
            <div className="max-w-md w-full space-y-6 bg-white/85 border border-amber-200/60 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-xl shadow-amber-900/5 relative z-10 my-auto">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[#c59b27] mb-1 shadow-sm">
                        <Crown className="w-6 h-6" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-serif">
                        অ্যাকাউন্ট তৈরি করুন
                    </h2>

                    <p className="text-xs font-normal text-slate-500 leading-relaxed max-w-xs mx-auto">
                        <span className="bg-gradient-to-r from-[#c59b27] to-[#8c6b12] bg-clip-text text-transparent font-semibold">Zara Launch</span>-এ যুক্ত হয়ে আমাদের প্রিমিয়াম কালেকশন এক্সপ্লোর করুন।
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">

                    {/* Full Name Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80 block pl-1">
                            আপনার পূর্ণ নাম
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-700/40 group-focus-within:text-[#c59b27] transition-colors">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="আপনার নাম লিখুন"
                                {...register("name", {
                                    required: "নাম প্রদান করা আবশ্যক",
                                    minLength: {
                                        value: 3,
                                        message: "নাম অন্তত ৩ অক্ষরের হতে হবে",
                                    },
                                })}
                                className={`w-full pl-11 pr-4 py-3 bg-amber-50/30 border rounded-xl text-sm focus:outline-none transition-all text-slate-800 placeholder:text-slate-400
                                ${errors.name ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30" : "border-amber-200/80 focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20"}`}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80 block pl-1">
                            ইমেইল অ্যাড্রেস
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-700/40 group-focus-within:text-[#c59b27] transition-colors">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="example@zaralaunch.com"
                                {...register("email", {
                                    required: "ইমেইল প্রদান করা আবশ্যক",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "সঠিক ইমেইল অ্যাড্রেস লিখুন",
                                    },
                                })}
                                className={`w-full pl-11 pr-4 py-3 bg-amber-50/30 border rounded-xl text-sm focus:outline-none transition-all text-slate-800 placeholder:text-slate-400
                                ${errors.email ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30" : "border-amber-200/80 focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20"}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80 block pl-1">
                            পাসওয়ার্ড
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-700/40 group-focus-within:text-[#c59b27] transition-colors">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "পাসওয়ার্ড প্রদান করা আবশ্যক",
                                    minLength: {
                                        value: 6,
                                        message: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে",
                                    },
                                })}
                                className={`w-full pl-11 pr-11 py-3 bg-amber-50/30 border rounded-xl text-sm focus:outline-none transition-all text-slate-800 placeholder:text-slate-400
                                ${errors.password ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30" : "border-amber-200/80 focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80 block pl-1">
                            পাসওয়ার্ড নিশ্চিত করুন
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-700/40 group-focus-within:text-[#c59b27] transition-colors">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword", {
                                    required: "পাসওয়ার্ড নিশ্চিত করা আবশ্যক",
                                    validate: (value) =>
                                        value === password || "পাসওয়ার্ড মিলছে না",
                                })}
                                className={`w-full pl-11 pr-11 py-3 bg-amber-50/30 border rounded-xl text-sm focus:outline-none transition-all text-slate-800 placeholder:text-slate-400
                                ${errors.confirmPassword ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30" : "border-amber-200/80 focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#a67c13] hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-amber-900/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm font-serif tracking-wide"
                    >
                        <span>{isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করুন"}</span>
                        <ArrowRight size={16} />
                    </button>
                </form>

                {/* Login Redirect */}
                <div className="text-center pt-2 border-t border-amber-100">
                    <p className="text-xs font-medium text-slate-500">
                        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                        <Link href="/login" className="font-semibold text-[#c59b27] hover:text-[#8c6b12] hover:underline transition-colors">
                            লগইন করুন
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Register() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
                    <div className="text-[#c59b27] font-semibold text-sm">লোড হচ্ছে...</div>
                </div>
            }
        >
            <RegisterContent />
        </Suspense>
    );
}