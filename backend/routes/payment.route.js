import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment.controller.js';


const router = express.Router();

// aga dar ba la real project kan webhook bakar bina
router.post('/create-checkout-session', protectRoute, createCheckoutSession);

// check krdn lo waya aw checkout man ba sarkawtu bu yan na
router.post('/checkout-success', protectRoute, checkoutSuccess)



export default router;



