import express from 'express';
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct } from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// katak deta aw route a yakam jar ba middleware protectRoute
// awja e duwam awja data kaman pe dadat 
router.get('/', protectRoute, adminRoute, getAllProducts);
// pewestman ba protect krdn nabet hamu kasak datanet beta aw route a
router.get("/featured", getFeaturedProducts);
// routek lo away product recommend bkain lo user ba 
// shewaki random product man lo recommedn bkat
router.get('/recommendations', getRecommendedProducts);
// routek lo away product man lo bet la rey aw category
// ka halle dabzheren /:category awa awaya ka hale dabzhern 
router.get('/category/:category', getProductsByCategory);
// routak lo create krdni product harwaha protect dakain 
// chunka ba admin loy haya product create bka 
router.post('/', protectRoute, adminRoute, createProduct);
// routek loway update productkan bkain bamnawe bcheta featured
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct);
// routek lo delete krdni product dubara
// hardu middleware bakar daynin hata bas admin btwanet
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default router;