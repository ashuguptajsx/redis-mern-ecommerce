import Coupon from "../models/coupon.model.js";

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({
            code,
            userId: req.user._id,
            isActive: true,
            expirationDate: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid or expired coupon code" });
        }

        res.json({
            code: coupon.code,
            discountPercentage: coupon.discountedPercentage,
            expirationDate: coupon.expirationDate
        });
    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).json({ message: "Error validating coupon", error: error.message });
    }
};

export const getUserCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            userId: req.user._id,
            isActive: true,
            expirationDate: { $gt: new Date() }
        });

        const formattedCoupons = coupons.map(coupon => ({
            code: coupon.code,
            discountPercentage: coupon.discountedPercentage,
            expirationDate: coupon.expirationDate,
            isActive: coupon.isActive
        }));

        res.json(formattedCoupons);
    } catch (error) {
        console.error("Error fetching user coupons:", error);
        res.status(500).json({ message: "Error fetching coupons", error: error.message });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const { code, discountedPercentage, expirationDate } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const coupon = new Coupon({
            code,
            discountedPercentage,
            expirationDate,
            userId: req.user._id,
            isActive: true
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
}; 