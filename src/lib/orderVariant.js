// অর্ডারের আইটেম থেকে ইউজারের বেছে নেওয়া সাইজ/মাপ/রঙ (ভ্যারিয়েন্ট) বের করার হেল্পার।
// নতুন অর্ডারে variantAttributes (অবজেক্ট) ও variantLabel (লেখা) দুটোই থাকে; পুরোনো অর্ডারে কিছুই না থাকতে পারে।

export const getVariantEntries = (item) => {
    const attrs = item?.variantAttributes;
    if (attrs && typeof attrs === "object") {
        const entries = attrs instanceof Map ? [...attrs.entries()] : Object.entries(attrs);
        const filtered = entries.filter(([key, value]) => key && value);
        if (filtered.length > 0) return filtered;
    }
    return [];
};

export const getVariantLabel = (item) => {
    const entries = getVariantEntries(item);
    if (entries.length > 0) return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
    return item?.variantLabel || "";
};
