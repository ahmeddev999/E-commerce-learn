import express from 'express';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'
const router = express.Router();


//du route man haya 
// yakam dana ba dast katane codakaya la user
router.get('/', protectRoute, getCoupon);

// lo check krdn
router.get('/validate', protectRoute, validateCoupon);

export default router;