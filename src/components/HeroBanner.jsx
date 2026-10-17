"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    { id: 1, src: "/hero-section-banner-1.png", alt: "Zara Launch Banner 1" },
    { id: 2, src: "/hero-section-banner-2.png", alt: "Zara Launch Banner 2" },
    { id: 3, src: "/hero-section-banner-3.png", alt: "Zara Launch Banner 3" },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5500);

        return () => clearInterval(interval);
    }, [nextSlide, isPaused]);

    return (
        <section
            className="w-full px-0 mx-0 overflow-hidden bg-[#FAF8F5]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ব্যানারের অনুপাত ২:১ ও ১৬:৯, তাই বক্স ১৯:১০ রাখা হয়েছে; উচ্চতা ৭২০px ও স্ক্রিনের (নেভবার বাদে) বেশি হবে না */}
            <div className="relative w-full aspect-[19/10] max-h-[min(720px,calc(100vh-5rem))] overflow-hidden">
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                                }`}
                        >
                            {/* চওড়া স্ক্রিনে পাশের ফাঁকা জায়গা ভরাতে একই ছবির ঝাপসা কপি */}
                            <Image
                                src={slide.src}
                                alt=""
                                aria-hidden="true"
                                fill
                                sizes="100vw"
                                className="object-cover object-center scale-110 blur-2xl opacity-60"
                            />
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className="object-contain object-center"
                            />
                        </div>
                    );
                })}

                {/* Minimal Navigation Arrows */}
                <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 rounded-full bg-[#2C2724]/25 hover:bg-[#2C2724]/70 text-[#FAF8F5] backdrop-blur-xs transition-all duration-200 focus:outline-none"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>

                <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 rounded-full bg-[#2C2724]/25 hover:bg-[#2C2724]/70 text-[#FAF8F5] backdrop-blur-xs transition-all duration-200 focus:outline-none"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>

                {/* Indicator Dots */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
                    {slides.map((_, dotIndex) => (
                        <button
                            key={dotIndex}
                            type="button"
                            onClick={() => setCurrentSlide(dotIndex)}
                            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 focus:outline-none ${dotIndex === currentSlide
                                    ? "w-4 sm:w-7 bg-[#2C2724]"
                                    : "w-1.5 sm:w-2 bg-[#2C2724]/25 hover:bg-[#2C2724]/50"
                                }`}
                            aria-label={`Go to slide ${dotIndex + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}