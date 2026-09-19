"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, ChevronDown, User } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    const openCart = useCartStore((state) => state.openCart);
    const totalCartItems = useCartStore((state) => state.getTotalItems)();

    return (
        <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E1D9] transition-all">
            <div className="w-full px-2 sm:px-3 md:px-4">
                <div className="flex items-center justify-between h-20">

                    {/* Left: Brand Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="group flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#2C2724] text-[#E0C9A6] flex items-center justify-center font-serif text-base tracking-widest transition-transform duration-300 group-hover:scale-105">
                                R
                            </span>
                            <div className="flex flex-col">
                                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#2C2724] uppercase leading-none">
                                    Zara Launch
                                </span>
                                <span className="text-[9px] tracking-[0.35em] text-[#8C7A6B] uppercase mt-1">
                                    Modern Fashion & Beauty Shop
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation (Visible only at 1024px and above) */}
                    <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
                        <Link
                            href="/"
                            className="text-sm tracking-widest uppercase font-medium text-[#2C2724] hover:text-[#9E7B66] transition-colors duration-200"
                        >
                            Home
                        </Link>

                        {/* Products Dropdown */}
                        <div className="relative group py-6">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-sm tracking-widest uppercase font-medium text-[#2C2724] hover:text-[#9E7B66] transition-colors duration-200"
                            >
                                <span>Products</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] transition-transform duration-300 group-hover:rotate-180" />
                            </button>

                            <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-64 bg-[#FCFBF9] border border-[#E8E1D9] shadow-xl rounded-xl p-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
                                <div className="flex flex-col space-y-1">
                                    <Link
                                        href="/products/burka"
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F4ECE4] transition-colors duration-200 group/item"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-[#9E7B66] mt-2 group-hover/item:scale-125 transition-transform" />
                                        <div>
                                            <p className="text-sm font-medium tracking-wider text-[#2C2724] group-hover/item:text-[#9E7B66] transition-colors">
                                                Burka & Abaya
                                            </p>
                                            <p className="text-xs text-[#8C7A6B] mt-0.5">
                                                Formal & bespoke silhouettes
                                            </p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/products/body-spray"
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F4ECE4] transition-colors duration-200 group/item"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-[#9E7B66] mt-2 group-hover/item:scale-125 transition-transform" />
                                        <div>
                                            <p className="text-sm font-medium tracking-wider text-[#2C2724] group-hover/item:text-[#9E7B66] transition-colors">
                                                Body Spray & Oud
                                            </p>
                                            <p className="text-xs text-[#8C7A6B] mt-0.5">
                                                Alcohol-free artisanal scents
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/about"
                            className="text-sm tracking-widest uppercase font-medium text-[#2C2724] hover:text-[#9E7B66] transition-colors duration-200"
                        >
                            About Us
                        </Link>
                    </nav>

                    {/* Right: Cart, Account & CTA */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        <button
                            type="button"
                            onClick={openCart}
                            className="relative p-2 text-[#2C2724] hover:text-[#9E7B66] transition-colors duration-200"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                            {totalCartItems > 0 && (
                                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#9E7B66] rounded-full ring-2 ring-[#FAF8F5]">
                                    {totalCartItems}
                                </span>
                            )}
                        </button>

                        <Link
                            href="/account/login"
                            className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#2C2724] bg-[#EFE8DF] hover:bg-[#E5DCD1] active:scale-[0.98] border border-[#DDD3C7] shadow-sm transition-all duration-200"
                        >
                            Get Started
                        </Link>

                        {/* Mobile / Tablet Menu Button (Visible up to 1023px, hidden from 1024px+) */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-[#2C2724] hover:text-[#9E7B66] focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Menu Drawer (Visible up to 1023px) */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-[#E8E1D9] bg-[#FAF8F5] px-3 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-3">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm font-medium tracking-wider uppercase text-[#2C2724] hover:bg-[#F3EDE6] rounded-lg transition-colors"
                        >
                            Home
                        </Link>

                        <div>
                            <button
                                type="button"
                                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium tracking-wider uppercase text-[#2C2724] hover:bg-[#F3EDE6] rounded-lg transition-colors"
                            >
                                <span>Products</span>
                                <ChevronDown className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`} />
                            </button>

                            {mobileProductsOpen && (
                                <div className="pl-6 pr-3 py-2 space-y-2 bg-[#F6F1EA] rounded-lg mt-1">
                                    <Link
                                        href="/products/burka"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1.5 text-xs tracking-wider uppercase font-medium text-[#2C2724] hover:text-[#9E7B66]"
                                    >
                                        Burka & Abaya
                                    </Link>
                                    <Link
                                        href="/products/body-spray"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1.5 text-xs tracking-wider uppercase font-medium text-[#2C2724] hover:text-[#9E7B66]"
                                    >
                                        Body Spray & Oud
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm font-medium tracking-wider uppercase text-[#2C2724] hover:bg-[#F3EDE6] rounded-lg transition-colors"
                        >
                            About Us
                        </Link>
                    </div>

                    <div className="pt-4 border-t border-[#E8E1D9] flex flex-col gap-3">
                        <Link
                            href="/account/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase text-[#2C2724] bg-[#EFE8DF] active:bg-[#E5DCD1] border border-[#DDD3C7] shadow-sm transition-colors"
                        >
                            <User className="w-4 h-4" />
                            <span>Get Started / Sign In</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}