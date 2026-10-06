"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, Check, ArrowRight, PackageSearch } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!trackingId) return;
        navigator.clipboard.writeText(trackingId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-lg bg-white border border-[#E8E1D9] rounded-2xl p-6 sm:p-10 shadow-sm text-center">
            {/* সাকসেস আইকন */}
            <div className="w-16 h-16 bg-[#F3EDE6] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-9 h-9 text-[#2C2724]" />
            </div>

            {/* হেডিং ও বার্তা */}
            <h1 className="text-2xl font-bold font-serif text-[#2C2724] mb-3">
                ধন্যবাদ আমাদের সাথে থাকার জন্য!
            </h1>
            <p className="text-sm text-[#70645C] leading-relaxed mb-6">
                আপনার অর্ডারটি আমরা সফলভাবে গ্রহণ করেছি। খুব শীঘ্রই আমাদের একজন প্রতিনিধি আপনার সাথে ফোনে যোগাযোগ করবেন।
            </p>

            {/* ট্র্যাকিং আইডি বক্স */}
            <div className="bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl p-5 mb-6 text-left">
                <p className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider mb-2">
                    আপনার ট্র্যাকিং আইডি
                </p>
                <div className="flex items-center justify-between gap-3 bg-white border border-[#E8E1D9] px-4 py-2.5 rounded-lg">
                    <span className="font-mono text-base sm:text-lg font-bold text-[#2C2724] tracking-wide">
                        {trackingId || "পাওয়া যায়নি"}
                    </span>
                    {trackingId && (
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C534D] hover:text-[#2C2724] transition-colors py-1 px-2 rounded hover:bg-[#FAF8F5]"
                            title="আইডি কপি করুন"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">কপি হয়েছে</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span>কপি করুন</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
                <p className=" text-xl text-[#8C7A6B] mt-2.5 leading-normal">
                    * প্রোডাক্ট ডেলিভারি ও অর্ডার সংক্রান্ত বিস্তারিত তথ্যের জন্য দয়া করে এই আইডিটি সংরক্ষণ করুন।
                </p>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                    href={`/track?trackingId=${trackingId || ""}`}
                    className="w-full sm:flex-1 py-3 px-4 bg-[#2C2724] text-[#FAF8F5] rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#3E3733] transition-colors flex items-center justify-center gap-2"
                >
                    <PackageSearch className="w-4 h-4" />
                    <span>অর্ডার ট্র্যাক করুন</span>
                </Link>
                <Link
                    href="/"
                    className="w-full sm:flex-1 py-3 px-4 bg-white border border-[#DDD3C7] text-[#2C2724] rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#FAF8F5] transition-colors flex items-center justify-center gap-2"
                >
                    <span>হোমে ফিরে যান</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-12">
            <Suspense fallback={<div className="text-sm text-[#70645C]">লোড হচ্ছে...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}