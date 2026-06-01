import mongoose from "mongoose";

// code awaya ka daxel dakre
// dis lo awaya chand dashkan bet satakay
// expD l away basarchuni dyar bkain
// isA bzanin kar dakat yan na
// uId aw useray ka bakari daynet
const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
},
{timestamps: true}
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;