import {create} from "zustand";

import {toast} from "react-hot-toast";

import axios from "../lib/axios";
// import { togglefeaturedProduct } from "../../../backend/controllers/product.controller";


export const useProductStore = create((set) =>({
    products :[],
    loading : false,
    setProducts : (products) => set({products}),
    
    createProduct : async(productData) =>{
        set({loading:true});
        try {
            const res = await axios.post("/products", productData);
            set((prevState) =>({
                products : [...prevState.products, res.data],
                loading : false
            }));
        } catch (error) {
            toast.error("Failed to create product");
            set({loading:false})
        }
    },


    fetchAllProducts: async () => {
        set({ loading: true });
        try {
          const res = await axios.get("/products");
          console.log("API response:", res.data); // Add this to debug
          set({ products: res.data, loading: false }); // Changed from res.data.products to res.data
        } catch (error) {
          toast.error("Failed to fetch products");
          set({ loading: false });
        }
      },


    toggleFeaturedProduct : async(id) =>{},
    deleteProduct : async(id) =>{},


}))