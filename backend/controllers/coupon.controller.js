import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
    try {
        // yakam match bbinawa katak req.user._id buni haya la DB w harwaha coupon kash active
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true});
        
        // agar hich buni nabu null bnerawa
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message});
    }
}


export const validateCoupon = async (req, res) => {
    try {
        // la frontend war dagrin codeka dtawanish bbi bayna params ba dlle xomana
        const {code} = req.body;

        // ba chand filteraki da dabayn 
        // yakam agar aw code hatya haman sht la DB habe
        // agar user._id haman sht bet lagal away 
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true});      
        
        // agar coupon ka buni nabu
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found"});
        }

        // agar basar chubu agar kati esta haya gchka tr bu lakati estaman
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired"});
        }

        // agaresh hich kam lawana nabu rastbu

        res.json({ 
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
        
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500),json({ message:"Server error", error: error.message}); 
    }
}