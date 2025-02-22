import {create } from  "zustand";

import axios from "../lib/axios";

import {toast} from "react-hot-toast";



export const useUserStore = create((set,get) => ({
    user:null,
    loading:false,
    checkingAuth:true,

    signup:async({name,email,password,confirmPassword})=>{
        set({loading:true});

        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            set({loading:false});
            return;
        }

        try{
            const res = await axios.post("/auth/signup",{name,email,password});
            set({user:res.data.user, loading:false});
            toast.success("Signup Successful");
        }catch(err){
            set({loading:false});
            toast.error(err.response.data.message);
        }
    },

    login:async ({email,password})=>{
        set({loading:true});
        try{
            const res = await axios.post("/auth/login",{email,password});
            set({user:res.data, loading:false});
            toast.success("Login Successful");
        }catch(err){
            set({loading:false});
            toast.error(err.response.data.message);
        }
    },

    checkAuth:async()=>{
        set({checkingAuth:true});
        try{
            const res = await axios.get("/auth/profile");
            set({user:res.data, checkingAuth:false});
        }catch(err){
            set({checkingAuth:false});
        }
    },

    logout:async()=>{
        set({loading:true});
        try{
            await axios.post("/auth/logout");
            set({user:null, loading:false});
            toast.success("Logout Successful");
        }catch(err){
            set({loading:false});
            toast.error(err.response.data.message);
        }
    }
}));