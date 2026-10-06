"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    SlidersHorizontal,
    ChevronDown,
    X,
    RotateCcw,
    Check,
    Search,
    Loader2,
} from "lucide-react";
import ProductCart from "@/components/ProductCart";
import { fetchAllProducts } from "@/lib/action/products";

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

function ShopContent() {
    const searchParams = useSearchParams();

    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedSubCategory, setSelectedSubCategory] = useState("ALL");
    const [maxPrice, setMaxPrice] = useState(50000);
    const [appliedMaxPrice, setAppliedMaxPrice] = useState(50000);
    const [sortBy, setSortBy] = useState("newest");

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const queryCategory = searchParams.get("category");
        const querySubCategory = searchParams.get("subCategory");

        setSelectedCategory(queryCategory || "ALL");
        setSelectedSubCategory(querySubCategory || "ALL");
    }, [searchParams]);

    const availableSubCategories = useMemo(() => {
        if (selectedCategory === "ALL") {
            return categoryConfig.flatMap((cat) => cat.subCategories);
        }
        const activeCat = categoryConfig.find((cat) => cat.value === selectedCategory);
        return activeCat ? activeCat.subCategories : [];
    }, [selectedCategory]);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                limit: 12,
                sortBy,
                maxPrice: appliedMaxPrice,
            };

            if (selectedCategory !== "ALL") params.category = selectedCategory;
            if (selectedSubCategory !== "ALL") params.subCategory = selectedSubCategory;
            if (activeSearch.trim()) params.search = activeSearch.trim();

            const response = await fetchAllProducts(params);

            setProducts(response?.data || []);
            setTotalProducts(response?.meta?.total || 0);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedSubCategory, appliedMaxPrice, sortBy, activeSearch]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setActiveSearch(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setActiveSearch("");
    };

    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        setSelectedSubCategory("ALL");
    };

    const toggleWishlist = (id) => {
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleResetFilters = () => {
        setSelectedCategory("ALL");
        setSelectedSubCategory("ALL");
        setMaxPrice(50000);
        setAppliedMaxPrice(50000);
        setSortBy("newest");
        setSearchInput("");
        setActiveSearch("");
    };

    const FilterContent = () => (
        <div className="w-full space-y-5 text-[#2C2724]">
            <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2724]">
                    ক্যাটাগরি
                </h3>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => handleCategoryChange("ALL")}
                        className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-3 py-2 rounded-lg transition-all ${selectedCategory === "ALL"
                                ? "bg-[#FAF8F5] text-[#2C2724] font-bold border border-[#E8E1D9]"
                                : "text-[#5C534D] hover:bg-[#FAF8F5] hover:text-[#2C2724]"
                            }`}
                    >
                        <span>সকল ক্যাটাগরি</span>
                        {selectedCategory === "ALL" && <Check className="w-3.5 h-3.5 text-[#9E7B66]" />}
                    </button>
                    {categoryConfig.map((cat) => {
                        const isSelected = selectedCategory === cat.value;
                        return (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-3 py-2 rounded-lg transition-all ${isSelected
                                        ? "bg-[#FAF8F5] text-[#2C2724] font-bold border border-[#E8E1D9]"
                                        : "text-[#5C534D] hover:bg-[#FAF8F5] hover:text-[#2C2724]"
                                    }`}
                            >
                                <span>{cat.labelBn}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#9E7B66]" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E8E1D9]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2724]">
                    সাব-ক্যাটাগরি
                </h3>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => setSelectedSubCategory("ALL")}
                        className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-3 py-2 rounded-lg transition-all ${selectedSubCategory === "ALL"
                                ? "bg-[#FAF8F5] text-[#2C2724] font-bold border border-[#E8E1D9]"
                                : "text-[#5C534D] hover:bg-[#FAF8F5] hover:text-[#2C2724]"
                            }`}
                    >
                        <span>সকল সাব-ক্যাটাগরি</span>
                        {selectedSubCategory === "ALL" && <Check className="w-3.5 h-3.5 text-[#9E7B66]" />}
                    </button>
                    {availableSubCategories.map((sub) => {
                        const isSelected = selectedSubCategory === sub.value;
                        return (
                            <button
                                key={sub.value}
                                type="button"
                                onClick={() => setSelectedSubCategory(sub.value)}
                                className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-3 py-2 rounded-lg transition-all ${isSelected
                                        ? "bg-[#FAF8F5] text-[#2C2724] font-bold border border-[#E8E1D9]"
                                        : "text-[#5C534D] hover:bg-[#FAF8F5] hover:text-[#2C2724]"
                                    }`}
                            >
                                <span>{sub.labelBn}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#9E7B66]" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E8E1D9]">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2724]">
                        সর্বোচ্চ মূল্য
                    </h3>
                    <span className="text-xs font-semibold text-[#9E7B66]">
                        ৳{Number(maxPrice).toLocaleString("bn-BD")}
                    </span>
                </div>

                <div className="space-y-1">
                    <input
                        type="range"
                        min="500"
                        max="50000"
                        step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        onMouseUp={() => setAppliedMaxPrice(maxPrice)}
                        onTouchEnd={() => setAppliedMaxPrice(maxPrice)}
                        className="w-full h-1.5 bg-[#E8E1D9] rounded-lg appearance-none cursor-pointer accent-[#2C2724]"
                    />
                    <div className="flex justify-between text-[11px] text-[#8C7A6B]">
                        <span>৳৫০০</span>
                        <span>৳৫০,০০০</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setAppliedMaxPrice(maxPrice);
                        setMobileFiltersOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#FAF8F5] bg-[#2C2724] hover:bg-[#3E3733] transition-colors"
                >
                    মূল্য ফিল্টার করুন
                </button>
            </div>

            <div className="pt-4 border-t border-[#E8E1D9]">
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#7C6E65] hover:text-[#2C2724] bg-[#FAF8F5] hover:bg-[#F3ECE4] border border-[#E8E1D9] flex items-center justify-center gap-1.5 transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ফিল্টার রিসেট</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-[#FAF8F5] text-[#2C2724] px-2 sm:px-3 md:px-4 py-4 sm:py-6">
            <div className="mb-4 sm:mb-6 space-y-1">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2724]">
                    আমাদের কালেকশন
                </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 mb-4 rounded-xl bg-[#FFFFFF] border border-[#E8E1D9]">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md flex items-center gap-2">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="পণ্য খুঁজুন এবং এন্টার চাপুন..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 text-xs sm:text-sm rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] text-[#2C2724] focus:outline-none focus:border-[#9E7B66]"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#2C2724]"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="px-3.5 py-2 rounded-lg bg-[#2C2724] text-[#FAF8F5] hover:bg-[#3E3733] transition-colors shrink-0"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </form>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="text-xs sm:text-sm font-medium text-[#5C534D]">
                        মোট <strong className="text-[#2C2724]">{totalProducts.toLocaleString("bn-BD")}</strong> টি পণ্য
                    </span>

                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#FAF8F5] border border-[#E8E1D9] text-[#2C2724]"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E7B66]" />
                        <span>ফিল্টার</span>
                    </button>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-[#FAF8F5] text-xs font-semibold text-[#2C2724] pl-3 pr-7 py-2 rounded-lg border border-[#E8E1D9] focus:outline-none focus:border-[#9E7B66] cursor-pointer"
                        >
                            <option value="newest">নতুন কালেকশন</option>
                            <option value="price_low_high">দাম: কম থেকে বেশি</option>
                            <option value="price_high_low">দাম: বেশি থেকে কম</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start">
                <aside className="hidden md:block w-60 lg:w-64 shrink-0 bg-[#FFFFFF] border border-[#E8E1D9] rounded-xl p-4 sticky top-20">
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E8E1D9]">
                        <span className="font-serif text-sm font-bold text-[#2C2724]">ফিল্টার অপশন</span>
                        <SlidersHorizontal className="w-4 h-4 text-[#9E7B66]" />
                    </div>
                    <FilterContent />
                </aside>

                <main className="flex-1 w-full">
                    {loading ? (
                        <div className="flex justify-center items-center py-24 text-[#9E7B66]">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-[#FFFFFF] border border-[#E8E1D9] rounded-xl p-8 text-center space-y-2">
                            <p className="text-sm font-semibold text-[#2C2724]">
                                কোনো পণ্য পাওয়া যায়নি
                            </p>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="mt-1 px-3 py-1.5 text-xs font-semibold text-[#FAF8F5] bg-[#2C2724] rounded-lg hover:bg-[#3E3733] transition-colors"
                            >
                                ফিল্টার রিসেট করুন
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                            {products.map((product) => (
                                <ProductCart
                                    key={product._id}
                                    product={product}
                                    toggleWishlist={toggleWishlist}
                                    wishlist={wishlist}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-[#201C1A]/50 backdrop-blur-xs"
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FFFFFF] p-4 shadow-xl overflow-y-auto flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D9] mb-4">
                                <span className="font-serif text-sm font-bold text-[#2C2724]">
                                    ফিল্টার
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="p-1 rounded-md text-[#7C6E65] hover:text-[#2C2724]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <FilterContent />
                        </div>

                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="mt-4 w-full py-2.5 rounded-lg bg-[#2C2724] text-[#FAF8F5] text-xs font-semibold"
                        >
                            ফলাফল দেখুন
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen bg-[#FAF8F5] flex justify-center items-center py-24 text-[#9E7B66]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}