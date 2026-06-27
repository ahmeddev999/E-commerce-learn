import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticRoutes from './routes/analytic.route.js'

const app = express();
const PORT = process.env.PORT || 5000;

//hata btwanin numna req.body bakar binin
app.use(express.json());
// middleware lo away cookies la request user wargrin
app.use(cookieParser());
// lo away durbin la cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,    
}));

app.use('/api/auth', authRoutes);
app.use('/api/products' , productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticRoutes)


//conecting database
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:` + PORT);
});  