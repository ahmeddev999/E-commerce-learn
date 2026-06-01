import mongoose from "mongoose";

//awa blue printakamana ka dabet har productak ku bet
//nmuna dallain dabet name habe w bapay dawa kare xomana
const productSchema = new mongoose.Schema({

name:{
    type: String,
    required: true
},

description:{
    type: String,
    required: true
},

price:{
    type: Number,
    required: true,
    min: 0
},

image:{
    type: String,
    required: [true, "Image is required"]
},

category:{
    type: String,
    required: true
},

isFeatured:{
    type:  Boolean,
    default: false
}

}, 
{timeseries: true});


//creating the model
const Product = mongoose.model("Product", productSchema);

export default Product;