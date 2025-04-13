import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { validateCoupon, getUserCoupons, createCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Validate a coupon code
router.post('/validate', validateCoupon);

// Get user's coupons
router.get('/user', getUserCoupons);

// Create a new coupon (admin only)
router.post('/', adminRoute, createCoupon);

export default router; 