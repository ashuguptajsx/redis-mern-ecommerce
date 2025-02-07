import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createCheckoutSession } from "../controllers/payment.controller";
import Coupon from "../models/coupon.model.js";
import {stripe} from "../lib/stripe.js";

const router = express.Router();


router.post("/create-checkout-session",protectRoute, async(req,res)=>{
    try {
        const{products,couponCode} = req.body

        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({message:"Please provide products"})
        }
        let totalAmount = 0;

        const lineItems = products.map((product)=>{
            const amount = Math.round(product.price * 100);
            totalAmount += amount*product.quantity;
            return {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:product.name,
                        images:[product.images]
                    },
                    unit_amount:amount
                },
                
            }
        })

        let coupon = null;
        if(couponCode){
            coupon = await coupon.findOne({code:couponCode, userId:req.user._id, isActive:true});
            if(coupon){
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-failed`,
        })
    } catch (error) {
        
    }
});


export default router;
