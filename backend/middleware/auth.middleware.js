import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Not authorized - No token provided"
            });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(401).json({ message: "Not authorized" });
    }
};

export const adminRoute = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized - No user found" });
    }
    
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized - Admin access required" });
    }
    
    next();
};

// Alias for backward compatibility
export const verifyToken = protectRoute;
