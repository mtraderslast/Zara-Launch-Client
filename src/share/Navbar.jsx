"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isAdmin = user?.role === "admin";
    const dashboardHref = `/dashboard/${user?.role}`;

    const openCart = useCartStore((state) => state.openCart);
    const items = useCartStore((state) => state.items);
    const totalCartItems = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E1D9] transition-all duration-300">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="group flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-[#2C2724] text-[#E0C9A6] flex items-center justify-center font-serif text-lg tracking-widest shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-[#3E3733] group-hover:shadow-md">
                                R
                            </span>
                            <div className="flex flex-col">
                                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#2C2724] uppercase leading-none transition-colors duration-300 group-hover:text-[#9E7B66]">
                                    Zara Launch
                                </span>
                                <span className="text-[9px] tracking-[0.35em] text-[#8C7A6B] uppercase mt-1">
                                    Modern Fashion & Beauty
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        <Link href="/" className="relative px-3 py-2 flex flex-col items-center group rounded-lg transition-all duration-300 hover:bg-[#F4ECE4]/60">
                            <span className="text-sm font-semibold tracking-wide text-[#2C2724] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#9E7B66]">হোম</span>
                            <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B] transition-colors duration-300 group-hover:text-[#9E7B66]">Home</span>
                        </Link>

                        <div className="relative group py-6">
                            <Link href="/products" className="relative px-3 py-2 flex items-center gap-1.5 rounded-lg transition-all duration-300 hover:bg-[#F4ECE4]/60 group/btn">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-semibold tracking-wide text-[#2C2724] transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:text-[#9E7B66]">পণ্যসমূহ</span>
                                    <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B] transition-colors duration-300 group-hover/btn:text-[#9E7B66]">Products</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[#8C7A6B] transition-transform duration-300 group-hover:rotate-180 group-hover/btn:text-[#9E7B66]" />
                            </Link>

                            <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-60 bg-[#FCFBF9] border border-[#E8E1D9] shadow-xl rounded-2xl p-2 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
                                <div className="flex flex-col space-y-1">
                                    <Link href="/products?category=Clothing" className="group/item p-2.5 rounded-xl hover:bg-[#F4ECE4] transition-all duration-200">
                                        <p className="text-sm font-medium text-[#2C2724] group-hover/item:translate-x-1 group-hover/item:text-[#9E7B66] transition-all">বোরকা ও আবায়া</p>
                                        <p className="text-[10px] tracking-wider uppercase text-[#8C7A6B] mt-0.5">Burka & Abaya</p>
                                    </Link>
                                    <Link href="/products?category=Fragrance" className="group/item p-2.5 rounded-xl hover:bg-[#F4ECE4] transition-all duration-200">
                                        <p className="text-sm font-medium text-[#2C2724] group-hover/item:translate-x-1 group-hover/item:text-[#9E7B66] transition-all">পারফিউম ও বডি স্প্রে</p>
                                        <p className="text-[10px] tracking-wider uppercase text-[#8C7A6B] mt-0.5">Perfume & Body Spray</p>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/combo" className="relative px-3 py-2 flex flex-col items-center group rounded-lg transition-all duration-300 hover:bg-[#F4ECE4]/60">
                            <span className="text-sm font-semibold tracking-wide text-[#2C2724] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#9E7B66]">কম্বো প্যাকেজ</span>
                            <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B] transition-colors duration-300 group-hover:text-[#9E7B66]">Combo Package</span>
                        </Link>

                        <Link href="/track" className="relative px-3 py-2 flex flex-col items-center group rounded-lg transition-all duration-300 hover:bg-[#F4ECE4]/60">
                            <span className="text-sm font-semibold tracking-wide text-[#2C2724] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#9E7B66]">ট্র্যাক অর্ডার</span>
                            <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B] transition-colors duration-300 group-hover:text-[#9E7B66]">Track Order</span>
                        </Link>
                    </nav>

                    {/* Cart & Auth Buttons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); openCart(); }}
                            className="relative p-2.5 text-[#2C2724] hover:text-[#9E7B66] rounded-full hover:bg-[#F4ECE4]/60 transition-all duration-300 active:scale-95"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                            {mounted && totalCartItems > 0 && (
                                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#9E7B66] rounded-full ring-2 ring-[#FAF8F5] animate-in zoom-in duration-200">
                                    {totalCartItems}
                                </span>
                            )}
                        </button>

                        {/* Dynamic Auth Actions */}
                        {isPending ? (
                            <div className="hidden lg:block w-24 h-9 bg-[#EFE8DF] animate-pulse rounded-full" />
                        ) : isAdmin ? (
                            /* Admin view: Dashboard Button */
                            <Link href={dashboardHref} className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.97] shadow-sm hover:shadow-md transition-all duration-300 group">
                                <LayoutDashboard className="w-3.5 h-3.5 text-[#E0C9A6] group-hover:rotate-12 transition-transform duration-300" />
                                <span>ড্যাশবোর্ড</span>
                            </Link>
                        ) : user ? (
                            /* Regular User view: Logout Button */
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-[#8B2626] bg-[#FDF2F2] hover:bg-[#FBE4E4] active:scale-[0.97] border border-[#F3C7C7] shadow-sm hover:shadow transition-all duration-300 group"
                            >
                                <LogOut className="w-3.5 h-3.5 text-[#8B2626] group-hover:-translate-x-0.5 transition-transform duration-300" />
                                <span>লগআউট</span>
                            </button>
                        ) : (
                            /* Guest view: Login Button */
                            <Link href="/login" className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-[#2C2724] bg-[#EFE8DF] hover:bg-[#E5DCD1] active:scale-[0.97] border border-[#DDD3C7] shadow-sm hover:shadow transition-all duration-300 group">
                                <User className="w-3.5 h-3.5 text-[#8C7A6B] group-hover:scale-110 transition-transform duration-300" />
                                <span>লগইন</span>
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-[#2C2724] hover:text-[#9E7B66] focus:outline-none transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-[#E8E1D9] bg-[#FAF8F5] px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-2">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F3EDE6] transition-colors">
                            <p className="text-sm font-semibold text-[#2C2724]">হোম</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#8C7A6B]">Home</p>
                        </Link>
                        <div>
                            <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F3EDE6] transition-colors">
                                <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                                    <p className="text-sm font-semibold text-[#2C2724]">পণ্যসমূহ</p>
                                    <p className="text-[10px] uppercase tracking-widest text-[#8C7A6B]">Products</p>
                                </Link>
                                <button type="button" onClick={() => setMobileProductsOpen(!mobileProductsOpen)} className="p-1">
                                    <ChevronDown className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`} />
                                </button>
                            </div>
                            {mobileProductsOpen && (
                                <div className="ml-4 pl-3 border-l-2 border-[#E8E1D9] my-1 space-y-2 py-1">
                                    <Link href="/products?category=Clothing" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-medium text-[#2C2724] hover:text-[#9E7B66]">বোরকা ও আবায়া (Burka & Abaya)</Link>
                                    <Link href="/products?category=Fragrance" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-medium text-[#2C2724] hover:text-[#9E7B66]">পারফিউম ও বডি স্প্রে (Perfume & Body Spray)</Link>
                                </div>
                            )}
                        </div>
                        <Link href="/combo" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F3EDE6] transition-colors">
                            <p className="text-sm font-semibold text-[#2C2724]">কম্বো প্যাকেজ</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#8C7A6B]">Combo Package</p>
                        </Link>
                        <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F3EDE6] transition-colors">
                            <p className="text-sm font-semibold text-[#2C2724]">ট্র্যাক অর্ডার</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#8C7A6B]">Track Order</p>
                        </Link>
                    </div>

                    <div className="pt-3 border-t border-[#E8E1D9]">
                        {isAdmin ? (
                            <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white bg-[#2C2724] active:bg-[#3E3733] shadow-sm transition-colors">
                                <LayoutDashboard className="w-4 h-4 text-[#E0C9A6]" />
                                <span>ড্যাশবোর্ডে যান</span>
                            </Link>
                        ) : user ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleSignOut();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-[#8B2626] bg-[#FDF2F2] active:bg-[#FBE4E4] border border-[#F3C7C7] shadow-sm transition-colors"
                            >
                                <LogOut className="w-4 h-4 text-[#8B2626]" />
                                <span>লগআউট</span>
                            </button>
                        ) : (
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-[#2C2724] bg-[#EFE8DF] active:bg-[#E5DCD1] border border-[#DDD3C7] shadow-sm transition-colors">
                                <User className="w-4 h-4 text-[#8C7A6B]" />
                                <span>লগইন / অ্যাকাউন্ট</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}