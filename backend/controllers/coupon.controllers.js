import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).josn({ message: "Invalid coupon code" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon has expired" });
    }
    res.json({
      message: "Coupon applied successfully",
      code: coupon.code,
      discountedPercentage: coupon.discountedPercentage,
    });
  } catch (error) {
    console.log(" Error in validationCoupon controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
