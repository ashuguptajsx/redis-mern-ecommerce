import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware";

const router =  express.Router();

router.get("/", protectRoute, adminRoute, async(req, res) =>{
    try {
        const analytics = await getAnalytics();
    } catch (error) {
        
    }
})

export default router;