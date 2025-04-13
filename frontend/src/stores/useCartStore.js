import {create} from "zustand"
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import {useEffect} from "react";

export const useCartStore = create((set, get) =>({
    cart:[],
    coupon:null,
    total:0,
    subtotal:0,

    calculateTotals: () => {
        const cart = get().cart;
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const total = get().coupon 
            ? subtotal - (subtotal * (get().coupon.discount / 100)) 
            : subtotal;
        set({ subtotal, total });
    },

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            
            set((state) => {
                const existingItem = state.cart.find((item) => item._id === product._id);
                if (existingItem) {
                    return {
                        cart: state.cart.map((item) =>
                            item._id === product._id 
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    };
                }
                return {
                    cart: [...state.cart, { ...product, quantity: 1 }]
                };
            });

            get().calculateTotals();
            toast.success("Product added to cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axios.post("/cart/remove", { productId });
            
            set((state) => ({
                cart: state.cart.filter((item) => item._id !== productId)
            }));
            
            get().calculateTotals();
            toast.success("Product removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            await axios.put(`/cart/${productId}`, { quantity });
            
            if (quantity === 0) {
                set((state) => ({
                    cart: state.cart.filter((item) => item._id !== productId)
                }));
            } else {
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item._id === productId 
                            ? { ...item, quantity }
                            : item
                    )
                }));
            }
            
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }
})) 