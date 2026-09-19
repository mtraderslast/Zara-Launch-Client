import { Eye, Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";

function ProductCart({ product, toggleWishlist, wishlist }) {
    const isWishlisted = wishlist.includes(product._id);
    const hasDiscount = product.discountRate > 0;

    return (
        <div
            className="group relative flex flex-col bg-[#FFFFFF] rounded-xl lg:rounded-2xl border border-[#E8E1D9] overflow-hidden hover:shadow-lg transition-all duration-300"
        >
            {/* Product Media Area */}
            <div className="relative w-full aspect-[3/4] bg-[#F5EFE9] overflow-hidden">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={product.images[0] || "/placeholder-product.jpg"}
                        alt={product.titleBn}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </Link>

                {/* Badges: Top Left */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
                    {hasDiscount && (
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider bg-[#2C2724] text-[#E0C9A6] shadow-xs">
                            {product.discountRate}% ছাড়
                        </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide bg-[#FAF8F5]/90 backdrop-blur-xs text-[#5C534D] border border-[#E8E1D9]">
                        {product.subCategory}
                    </span>
                </div>

                {/* Wishlist Button: Top Right */}
                <button
                    type="button"
                    onClick={() => toggleWishlist(product._id)}
                    aria-label="Add to Wishlist"
                    className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FFFFFF] text-[#2C2724] shadow-xs backdrop-blur-xs transition-colors duration-200"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isWishlisted
                            ? "fill-[#9E7B66] text-[#9E7B66]"
                            : "text-[#4A423D] hover:text-[#9E7B66]"
                            }`}
                    />
                </button>

                {/* Quick View Button: Visible on Desktop Hover */}
                <Link
                    href={`/products/${product.slug}`}
                    className="hidden md:inline-flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/90 hover:bg-[#2C2724] hover:text-[#FAF8F5] text-[#2C2724] text-xs font-medium tracking-wider backdrop-blur-xs shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    <Eye className="w-3.5 h-3.5" />
                    <span>কুইক ভিউ</span>
                </Link>
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
                <div>
                    {/* Variants Tag */}
                    {product.hasVariants && (
                        <span className="text-[10px] font-medium text-[#8C7A6B] block mb-1">
                            বিভিন্ন সাইজ এভেলেবল
                        </span>
                    )}

                    {/* Title */}
                    <Link href={`/products/${product.slug}`}>
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#2C2724] line-clamp-1 hover:text-[#9E7B66] transition-colors">
                            {product.titleBn}
                        </h3>
                    </Link>

                    {/* Pricing Display */}
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#2C2724]">
                            ৳{product.discountedPrice.toLocaleString("bn-BD")}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs sm:text-sm text-[#A89F91] line-through">
                                ৳{product.price.toLocaleString("bn-BD")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Cart Action Button */}
                <div className="mt-3.5 sm:mt-4 pt-2 border-t border-[#F2ECE4]">
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] active:scale-[0.98] transition-all duration-200 shadow-xs"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#E0C9A6]" />
                        <span>কার্টে রাখুন</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCart