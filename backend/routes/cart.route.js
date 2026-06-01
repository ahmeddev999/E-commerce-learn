import express from 'express';
const router = express.Router();
import { addToCart, removeAllFromCart, updateQuantity, getCartProducts } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


// routek katak user productek dawa dakat
// lera tanha pewestman ba protect route haya 
// chunka user datwanet daway product bka ballam dabet auth bubet loya ba protectRoute dazanin
router.post('/', protectRoute , addToCart);
// routek katak user aw producta la cart nahelet
router.delete('/', protectRoute , removeAllFromCart);
// routek agar user beyawet zhmaray product zyadbka yan kam
router.put('/:id', protectRoute , updateQuantity);
// routek katak damanawet hamu product kanman nishan bdat ka la cartn
router.get('/', protectRoute , getCartProducts);


export default router;