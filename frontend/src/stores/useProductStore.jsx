import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error("Failed to create product");
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      console.log("API response:", res.data); // Debug log
      set({ products: res.data, loading: false }); // Adjust based on API response structure
    } catch (error) {
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      set({ loading: false });
      toast.error("Failed to toggle featured product");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  },

  fetchProductsByCategory: async (category) => {
  set({ loading: true });
  try {
    const res = await axios.get(`/products/category/${category}`); // Fixed URL
    console.log("Category API response:", res.data);
    set({ products: res.data, loading: false });
  } catch (error) {
    console.error("Fetch by category error:", error.response?.data || error.message);
    set({ loading: false });
    toast.error(error.response?.data?.message || "Failed to fetch products");
  }
},
}));