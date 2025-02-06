import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import paymentRoutes from './routes/payment.routes.js';

import { connectDb } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes) 
app.use("/api/products",productRoutes)
app.use("api/cart", cartRoutes) 
app.use("/api/coupon", couponRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDb();
})

