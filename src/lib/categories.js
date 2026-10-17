// প্রোডাক্ট ক্যাটাগরি ও সাব-ক্যাটাগরির একমাত্র সোর্স।
// value গুলো ডাটাবেসে সেভ হয়, তাই পরিবর্তন করলে সার্ভারের src/utils/categories.js ও আপডেট করতে হবে।
export const categoryConfig = [
    {
        labelBn: "পোশাক",
        labelEn: "Clothing",
        value: "Clothing",
        subCategories: [
            { labelBn: "বোরকা", labelEn: "Burqa", value: "Burqa" },
            { labelBn: "আবায়া", labelEn: "Abaya", value: "Abaya" },
            { labelBn: "হিজাব", labelEn: "Hijab", value: "Hijab" },
            { labelBn: "নিকাব", labelEn: "Niqab", value: "Niqab" },
            { labelBn: "হাত মোজা", labelEn: "Hand Socks", value: "Hand Socks" },
            { labelBn: "পা মোজা", labelEn: "Foot Socks", value: "Foot Socks" },
        ],
    },
    {
        labelBn: "সুগন্ধি",
        labelEn: "Fragrance",
        value: "Fragrance",
        subCategories: [
            { labelBn: "পারফিউম", labelEn: "Perfume", value: "Perfume" },
            { labelBn: "বডি স্প্রে", labelEn: "Body Spray", value: "Body Spray" },
        ],
    },
    {
        labelBn: "ঘড়ি ও এক্সেসরিজ",
        labelEn: "Watch & Accessories",
        value: "Accessories",
        subCategories: [
            { labelBn: "ঘড়ি", labelEn: "Watch", value: "Watch" },
        ],
    },
    {
        labelBn: "স্কিন কেয়ার",
        labelEn: "Skin Care",
        value: "Skin Care",
        subCategories: [
            { labelBn: "ময়েশ্চারাইজার", labelEn: "Moisturizer", value: "Moisturizer", brands: ["CeraVe", "Cetaphil"] },
            { labelBn: "সানস্ক্রিন", labelEn: "Sunscreen", value: "Sunscreen", brands: ["Eucerin", "Bioderma"] },
            { labelBn: "ব্রণপ্রবণ ত্বকের ফেসওয়াশ", labelEn: "Acne Face Wash", value: "Acne Face Wash", brands: ["Neutrogena", "CeraVe"] },
            { labelBn: "জেন্টল ক্লিনজার", labelEn: "Gentle Cleanser", value: "Gentle Cleanser", brands: ["Cetaphil", "Simple"] },
        ],
    },
    {
        labelBn: "হেয়ার কেয়ার",
        labelEn: "Hair Care",
        value: "Hair Care",
        subCategories: [
            { labelBn: "শ্যাম্পু", labelEn: "Shampoo", value: "Shampoo", brands: ["OGX", "Head & Shoulders"] },
        ],
    },
    {
        labelBn: "বডি কেয়ার",
        labelEn: "Body Care",
        value: "Body Care",
        subCategories: [
            { labelBn: "বডি ওয়াশ", labelEn: "Body Wash", value: "Body Wash", brands: ["OUD", "Dove", "Nivea"] },
            { labelBn: "বডি লোশন", labelEn: "Body Lotion", value: "Body Lotion", brands: ["OUD", "Vaseline", "Nivea"] },
        ],
    },
    {
        labelBn: "বেবি কেয়ার",
        labelEn: "Baby Care",
        value: "Baby Care",
        subCategories: [
            { labelBn: "বাচ্চাদের ক্রিম", labelEn: "Baby Cream", value: "Baby Cream", brands: ["Mustela", "Sebamed Baby"] },
            { labelBn: "বাচ্চাদের লোশন", labelEn: "Baby Lotion", value: "Baby Lotion", brands: ["Aveeno Baby", "Mustela"] },
        ],
    },
];

export const getCategory = (value) => categoryConfig.find((c) => c.value === value) || null;

export const getSubCategory = (categoryValue, subValue) =>
    getCategory(categoryValue)?.subCategories.find((s) => s.value === subValue) || null;

export const getCategoryLabel = (value) => {
    const cat = getCategory(value);
    return cat ? cat.labelBn : value;
};

export const getSubCategoryLabel = (subValue) => {
    for (const cat of categoryConfig) {
        const sub = cat.subCategories.find((s) => s.value === subValue);
        if (sub) return sub.labelBn;
    }
    return subValue;
};

export const getBrandSuggestions = (categoryValue, subValue) => {
    const cat = getCategory(categoryValue);
    if (!cat) return [];
    const subs = subValue ? cat.subCategories.filter((s) => s.value === subValue) : cat.subCategories;
    return [...new Set(subs.flatMap((s) => s.brands || []))];
};

export const productsHref = (categoryValue, subValue) => {
    const params = new URLSearchParams();
    if (categoryValue) params.set("category", categoryValue);
    if (subValue) params.set("subCategory", subValue);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
};
