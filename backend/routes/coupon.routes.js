import express from "express";
import { getCoupons } from "../controllers/coupon.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateCoupon } from "../controllers/coupon.controllers.js";


const router = express.Router();


router.get("/", protectRoute, getCoupons);
router.get("/validate", protectRoute, validateCoupon);


export default router; 