import Product from "../models/product.model.js";

// item.id xalata labar away in the user model cartItems is defined as 
// product: the referenced product ObjectId and the quantity is amount

export const addToCart = async (req, res) => {
    try {

        // id e product ka la user wardagren aw nawa la frontend day danain
        const {productId} = req.body;
        // aw useray aw requestay krdya la protectRoute war dagrin
        const user = req.user;

        // yakam jar tamsha dakain aya aw itema lanaw carItems haya
        // ama lanaw user dagaren ka doc hamu shtakani taybat ba user tedaya
        const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
        // agar aw product ID ya lanaw habu kawata buni haya loya agar
        // har chand be koy 1 dakain agar buni habu agar nabu
        // return example existingItem = { id: "123", quantity: 1 }
        if (existingItem) {
            // zyadi bka ba yak w existingItem productka baxoyte
            existingItem.quantity += 1; // { id: "123", quantity: 2 }
        } else {
            // agar hich productak buni nabu baw idya
            // tanha id danern baxoy quantity pedadat ka by default yaka
            user.cartItems.push({ product: productId, quantity: 1});
        }

        //save dakain lo naw DB
        await user.save();
        res.json(user.cartItems); 
    } catch (error) {
        console.log("Error in addToCart", error.message);
        res.status(500).json({ message: "Error in Server", error: error.message});
    }

}


export const removeAllFromCart = async (req, res) => {
    try {
        // ba dast henani id product
        const { productId } = req.body;
        // ba dast henani user
        const user = req.user;

        // agar aw id buni nabu
        if (!productId) {
            user.cartItems = [];
        } else {
            // yaksani dakain baway peshamn dallen hamu itemakan laxoy bgre jga lawanay yaksana baw idya
            user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
        }
        
        // save dakain lo naw DB
        await user.save();

        // nwe tren goran kare lo fontend danerenawa
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in removeAllFromCart", error.message);
        res.status(500).json({ message: "Error in Server", error: error.message});
    }

}


export const updateQuantity = async (req, res) => { 
    try {
        // yakam jar productId war dagrin la params w id dakina productId hata runtr be
        const {id: productId} = req.params;
        // zhmaray productkan ka la frontend lo man detawa
        const {quantity} = req.body;
        // useraka
        const user = req.user;

        // lanaw cartItems e user bgare aya aw productId buni haya
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);

        // agar existingItem buni habu baw id ya
        if (existingItem) {
            // check dakain nawak quantity 0 bet aw producta
            // awa lo halatak agar krdya 0
            if (quantity === 0) {
                // awa nayhelen bune habet lanaw cartItems
                // takid kawa laway ka yaksiani dakinawa ba user.cartItems
               user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
                // save dakain la DB
                await user.save();
                // return dakain hata nwetren update habet
                return res.json(user.cartItems);
            }

            // agar yaksan nabu ba sfr awa if sare esh nakat deyna era
            
            // dalain quantity aw producta har chand bet yaksani bka baway loman hatya
            // existingItem productakaya ka qauntity dast kare kraya jyawaza lagal user.cartItems
            // awaja lera qauntity kay yaksan dakain baway la frontend hatya
            existingItem.quantity = quantity;
            // save dakain lo DB
            await user.save();

            // cartItems kan danerenawa
            res.json(user.cartItems);
        } else {
            return res.status(404).json({ message: "Product not found"});
        }

    } catch (error) {
        console.log("Error in updateQuantity", error.message);
        res.status(500).json({ message: "Error in server", error: error.message});
    }
}

export const getCartProducts = async (req, res) => {
    try {

        // Go through every item inside req.user.cartItems and take only the product id 
        const productIds = req.user.cartItems.map(item => item.product);

        // Go to the Product collection and find all products whose _id is inside productIds.
        const products = await Product.find({ _id: { $in: productIds }}); // _id is one of these ids    
        
        // Create a lookup table where each product ID points to its quantity in the user's cart.
        // Example: "productId123" => 2
        const quantityByProductId = new Map(
            req.user.cartItems.map(item => [item.product.toString(), item.quantity])
        );

        // Go through each product from the DB and create a new object that contains
        // all product data plus the quantity from the user's cart.
        const cartItems = products.map(product => ({
            ...product.toJSON(), quantity: quantityByProductId.get(product._id.toString()) || 0,
        }));


        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts", error.message);
        res.status(500).json({ message: "Error in Server", error: error.message});
    }
}   


