import { create } from "zustand";
import { persist } from "zustand/middleware";

// অ্যাট্রিবিউটের ক্রম যাই হোক, একই ভ্যারিয়েন্টের জন্য একই ID তৈরি হবে
const buildCartItemId = (slug, selectedAttributes = {}) => {
    const sorted = Object.keys(selectedAttributes)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: selectedAttributes[key] }), {});
    return `${slug}-${JSON.stringify(sorted)}`;
};

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            addToCart: (slug, quantity = 1, selectedAttributes = {}, variantSku = null) => {
                const cartItemId = buildCartItemId(slug, selectedAttributes);
                set((state) => {
                    const existingItem = state.items.find((i) => i.cartItemId === cartItemId);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.cartItemId === cartItemId
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }
                    return {
                        items: [
                            ...state.items,
                            { cartItemId, slug, quantity, selectedAttributes, variantSku },
                        ],
                    };
                });
            },

            updateQuantity: (cartItemId, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map((i) =>
                        i.cartItemId === cartItemId ? { ...i, quantity } : i
                    ),
                }));
            },

            removeFromCart: (cartItemId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.cartItemId !== cartItemId),
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: "zara-product-cart", // লোকাল স্টোরেজ নাম
        }
    )
);
