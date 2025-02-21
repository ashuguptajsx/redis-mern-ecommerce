import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // ✅ Import CORS middleware
import cookieParser from 'cookie-parser';




import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

import { connectDb } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// ✅ CORS Middleware
app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend requests
    credentials: true,  // Allow cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Fix: Ensure all routes start with "/api/"
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);  // Fix missing "/"
app.use("/api/coupon", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
});
