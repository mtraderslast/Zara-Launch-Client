import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const generateCartItemId = (productId, selectedVariants = {}) => {
    const variantKey = Object.entries(selectedVariants)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, val]) => `${key}:${val}`)
        .join("|");
    return variantKey ? `${productId}_${variantKey}` : `${productId}`;
};

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            addToCart: (product, quantity = 1, selectedVariants = {}) => {
                const cartItemId = generateCartItemId(product._id, selectedVariants);
                const { items } = get();
                const existingIndex = items.findIndex((item) => item.cartItemId === cartItemId);

                if (existingIndex > -1) {
                    const updatedItems = [...items];
                    const newQty = updatedItems[existingIndex].quantity + quantity;
                    const maxStock = updatedItems[existingIndex].stock ?? Infinity;

                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        quantity: Math.min(newQty, maxStock),
                    };

                    set({ items: updatedItems, isOpen: true });
                } else {
                    const newItem = {
                        cartItemId,
                        productId: product._id,
                        titleEn: product.titleEn || product.title,
                        titleBn: product.titleBn,
                        slug: product.slug,
                        image: product.images?.[0] || product.image || "/placeholder-product.jpg",
                        price: Number(product.discountedPrice || product.price || 0),
                        originalPrice: Number(product.price || 0),
                        stock: product.stock ?? 99,
                        selectedVariants,
                        quantity,
                    };

                    set({ items: [...items, newItem], isOpen: true });
                }
            },

            removeFromCart: (cartItemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.cartItemId !== cartItemId),
                }));
            },

            updateQuantity: (cartItemId, newQuantity) => {
                if (newQuantity <= 0) {
                    get().removeFromCart(cartItemId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.cartItemId === cartItemId) {
                            const maxStock = item.stock ?? Infinity;
                            return { ...item, quantity: Math.min(newQuantity, maxStock) };
                        }
                        return item;
                    }),
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: "zara-launch-cart",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items }),
        }
    )
);