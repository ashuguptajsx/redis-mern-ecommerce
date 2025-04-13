import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

// Protect all payment routes
router.use(protectRoute);

// Create a checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Handle successful checkout
router.post("/checkout-success", checkoutSuccess);

export default router;