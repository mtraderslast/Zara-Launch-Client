// প্রোডাক্ট ও ভ্যারিয়েন্টের দাম হিসাবের শেয়ার্ড ফাংশন (সার্ভারের utils/pricing.js এর সাথে মিল রাখা হয়েছে)
//
// নিয়ম:
//  - product.price         = মূল দাম
//  - product.discountPrice = ডিসকাউন্ট দাম (ঐচ্ছিক, মূল দামের চেয়ে কম হতে হবে)
//  - ভ্যারিয়েন্টে নিজস্ব price থাকলে সেটাই মূল দাম; তখন শুধু ভ্যারিয়েন্টের নিজের discountPrice প্রযোজ্য

const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export const getUnitPricing = (product, variant = null) => {
    const variantPrice = toNumber(variant?.price);
    const variantDiscount = toNumber(variant?.discountPrice);

    const basePrice = variantPrice > 0 ? variantPrice : toNumber(product?.price);

    let discountPrice = 0;
    if (variantDiscount > 0) {
        discountPrice = variantDiscount;
    } else if (variantPrice <= 0) {
        discountPrice = toNumber(product?.discountPrice);
    }

    const hasDiscount = discountPrice > 0 && discountPrice < basePrice;
    const finalPrice = hasDiscount ? discountPrice : basePrice;

    return {
        basePrice,
        finalPrice,
        hasDiscount,
        savedAmount: hasDiscount ? basePrice - finalPrice : 0,
    };
};

// নির্বাচিত অ্যাট্রিবিউটের সাথে হুবহু মেলে এমন ভ্যারিয়েন্ট (না মিললে null)
export const findMatchingVariant = (product, selectedAttributes = {}) => {
    if (!product?.hasVariants || !product?.variants?.length) return null;

    const entries = Object.entries(selectedAttributes || {});
    if (entries.length === 0) return null;

    return (
        product.variants.find((variant) =>
            entries.every(([key, value]) => variant.attributes?.[key] === value)
        ) || null
    );
};

// প্রোডাক্টের সব ভ্যারিয়েন্ট থেকে অপশন তালিকা: { Size: ["42","46","52"], Color: [...] }
export const getAttributeOptions = (product) => {
    if (!product?.hasVariants || !product?.variants?.length) return {};

    const options = {};
    product.variants.forEach((variant) => {
        Object.entries(variant.attributes || {}).forEach(([key, value]) => {
            if (!options[key]) options[key] = [];
            if (!options[key].includes(value)) options[key].push(value);
        });
    });

    // সংখ্যা হলে সংখ্যা অনুযায়ী (42, 46, 52), নইলে যেভাবে আছে সেভাবেই
    Object.keys(options).forEach((key) => {
        const allNumeric = options[key].every((v) => v !== "" && !Number.isNaN(Number(v)));
        if (allNumeric) options[key].sort((a, b) => Number(a) - Number(b));
    });

    return options;
};

/**
 * কোনো অ্যাট্রিবিউটের মান বদলালে এমন ভ্যারিয়েন্টের অ্যাট্রিবিউট ফেরত দেয় যা আসলেই আছে।
 * (যেমন Color=Black + Size=42 না থাকলে, Size=42 আছে এমন প্রথম ভ্যারিয়েন্টে সরে যায়)
 */
export const selectAttribute = (product, currentAttributes, key, value) => {
    const variants = product?.variants || [];
    const next = { ...currentAttributes, [key]: value };

    const exact = variants.find((v) =>
        Object.entries(next).every(([k, val]) => v.attributes?.[k] === val)
    );
    if (exact) return { ...exact.attributes };

    const sameValue = variants.find((v) => v.attributes?.[key] === value);
    return sameValue ? { ...sameValue.attributes } : next;
};
