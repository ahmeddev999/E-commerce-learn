import mongoose from "mongoose";


// lerada schemaka desing dakain ka chon bet
// lerada ama lanaw array products yak obj man haya ka 3 props laxo dagret
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    stripSessionId: {
        type: String,
        unique: true,
    },
},
{timestamps: true}
)

//lerash model kaman drust dakain
const Order = mongoose.model("Order", orderSchema);

export default Order;


//numnak laway ka lowman detawa
// {
//   user: "userId123",
//   products: [
//     {
//       product: "productId1",
//       quantity: 2,
//       price: 100
//     },
//     {
//       product: "productId2",
//       quantity: 1,
//       price: 50
//     }
//   ],
//   totalAmount: 250
// }


