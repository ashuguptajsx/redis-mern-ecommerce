import express from "express";
import { getCoupons } from "../controllers/coupon.controller.js";
import { protectedRoutes } from "../middlewares/auth.middlewares.js";

const router = express.Router();


router.get("/", protectedRoutes, getCoupons);
router.get("/validate", protectedRoutes, validateCoupon);


export default router; 