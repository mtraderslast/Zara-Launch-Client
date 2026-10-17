import { MailBadge, MapPinCheck, PhoneCall, Send } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { CONTACT } from "@/lib/contact";


export default function Footer() {
    return (
        <footer className="w-full bg-[#FAF8F5] text-[#2C2724] border-t border-[#E8E1D9]">
            {/* Main Footer Container */}
            <div className="w-full px-2 sm:px-3 md:px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

                    {/* Column 1: Brand & Contact Info */}
                    <div className="lg:col-span-4 space-y-5">
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

                        <p className="text-sm leading-relaxed text-[#5C534D] max-w-sm">
                            আমাদের লক্ষ্য আধুনিক ও শালীন ফ্যাশনের সমন্বয়ে আপনাকে মানসম্মত ও রুচিশীল পোশাকের এক অনন্য অভিজ্ঞতা উপহার দেওয়া।
                        </p>

                        <div className="space-y-2.5 pt-1">
                            <div className="flex items-start gap-3 text-sm text-[#4A423D]">
                                <MapPinCheck className="w-4 h-4 text-[#9E7B66] shrink-0 mt-0.5" />
                                <span>{CONTACT.address}</span>
                            </div>
                            <a href={`tel:${CONTACT.phoneE164}`} className="flex items-center gap-3 text-sm text-[#4A423D] hover:text-[#9E7B66] transition-colors">
                                <PhoneCall className="w-4 h-4 text-[#9E7B66] shrink-0" />
                                <span dir="ltr">{CONTACT.phoneDisplay}</span>
                            </a>
                            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-[#4A423D] hover:text-[#9E7B66] transition-colors">
                                <FaWhatsapp className="w-4 h-4 text-[#9E7B66] shrink-0" />
                                <span dir="ltr">{CONTACT.phoneDisplay}</span>
                            </a>
                            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-sm text-[#4A423D] hover:text-[#9E7B66] transition-colors">
                                <MailBadge className="w-4 h-4 text-[#9E7B66] shrink-0" />
                                <span>{CONTACT.email}</span>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="lg:col-span-3 lg:col-start-6 space-y-4">
                        <h3 className="text-sm font-semibold text-[#2C2724] uppercase tracking-wider relative inline-block after:content-[''] after:block after:w-7 after:h-[2px] after:bg-[#9E7B66] after:mt-1.5">
                            কুইক লিংকস
                        </h3>
                        <ul className="space-y-2.5 text-sm text-[#5C534D]">
                            <li>
                                <Link href="/" className="hover:text-[#9E7B66] hover:translate-x-1 inline-block transition-all duration-200">
                                    হোম
                                </Link>
                            </li>
                            <li>
                                <Link href="/combo" className="hover:text-[#9E7B66] hover:translate-x-1 inline-block transition-all duration-200">
                                    কম্বো প্যাকেজ
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-[#9E7B66] hover:translate-x-1 inline-block transition-all duration-200">
                                    পণ্যসমূহ
                                </Link>
                            </li>
                            <li>
                                <Link href="/track" className="hover:text-[#9E7B66] hover:translate-x-1 inline-block transition-all duration-200">
                                    অর্ডার ট্র্যাক করুন
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Social */}
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="text-sm font-semibold text-[#2C2724] uppercase tracking-wider relative inline-block after:content-[''] after:block after:w-7 after:h-[2px] after:bg-[#9E7B66] after:mt-1.5">
                            যুক্ত থাকুন
                        </h3>
                        <p className="text-sm text-[#5C534D] leading-relaxed">
                            নতুন কালেকশন ও স্পেশাল অফার সম্পর্কে নিয়মিত আপডেট পেতে আপনার ইমেইল দিন।
                        </p>

                        {/* Newsletter Input Box */}
                        <form className="flex items-center w-full max-w-md">
                            <input
                                type="email"
                                placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন"
                                className="w-full bg-[#FFFFFF] text-sm text-[#2C2724] placeholder-[#9E9084] px-3.5 py-2.5 rounded-l-md border border-[#D9CEBF] focus:outline-none focus:border-[#9E7B66] transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-[#2C2724] hover:bg-[#3E3733] text-[#FAF8F5] px-4 py-2.5 rounded-r-md text-sm font-medium flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                            >
                                <span>সাবস্ক্রাইব</span>
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        {/* Social Media Links */}
                        <div className="pt-2">
                            <span className="text-[11px] uppercase tracking-widest text-[#8C7A6B] block mb-2.5 font-medium">
                                সোশ্যাল মিডিয়া
                            </span>
                            <div className="flex items-center gap-2.5">
                                <a
                                    href={CONTACT.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-[#EDE6DC] hover:bg-[#9E7B66] flex items-center justify-center text-[#2C2724] hover:text-white transition-colors duration-200"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook className="w-4 h-4" />
                                </a>
                                <a
                                    href={CONTACT.whatsapp}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-[#EDE6DC] hover:bg-[#9E7B66] flex items-center justify-center text-[#2C2724] hover:text-white transition-colors duration-200"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                </a>
                                <a
                                    href={CONTACT.tiktok}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-[#EDE6DC] hover:bg-[#9E7B66] flex items-center justify-center text-[#2C2724] hover:text-white transition-colors duration-200"
                                    aria-label="TikTok"
                                >
                                    <FaTiktok className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar: Copyright & Payment Badges */}
            <div className="border-t border-[#E8E1D9] bg-[#F4EFEA]">
                <div className="w-full px-2 sm:px-3 md:px-4 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#6E635B] tracking-wide text-center md:text-left">
                        © 2026 Zara Launch. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}