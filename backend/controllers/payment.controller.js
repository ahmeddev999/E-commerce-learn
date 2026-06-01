import Coupon from '../models/coupon.model.js';
import Order from '../models/order.model.js';
import { stripe } from '../lib/stripe.js';

export const createCheckoutSession = async (req, res) => {
    try {
        // away la frontend loman det ka la user war dagrin
        //         {
        //   products: [
        //     {
        //       id: "1",
        //       price: 100,
        //       quantity: 2
        //     },
        //     {
        //       id: "3",
        //       price: 50,
        //       quantity: 1
        //     }
        //   ],
        //   couponCode: "SAVE20"
        // }
        const { products, couponCode } = req.body;

        // check dakain bzanin la sheway   arraya products w aya hiche tedaya ?
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array"});
        }
        

        // ama har jarak lanaw lineItems ka banaw productak da darwat
        // koy nrxi productakan koy away dakain hata axere total man lo dar dache
        let totalAmount = 0;


        // lerada map harjarak ka dachta naw productak lawe dakina cent w ba pay quantity aw producta koyan dakinawa
        // pashan koy totalAmount dakain dubara dachina naw productke deka haman sht dakainawa w dubara addi totalAmount dakain 
        // ka tawaw bu productakan awja koy gshti parakaman lo dar dachet w har productak return dakinawa manay away neya agar
        // return lerabu tawaw routeka tawaw dabi awa tanha datay har itemaka lo stripe danerenawa
        const lineItems = products.map((product) => {
            // stripe daway cent le daka loaya ama jarani 100 dakain
            // aw math round bakar danin hata agar buwa cent yani singuler awa begoret lo nziktren intger
            const amount = Math.round(product.price * 100); 
            // dallain totalAmount koy away bka aw amountay haya jarani zhmaray productakan bka chand danaya
            // yani agar 100 dolar be quantity 3 bet dabeta 300 dolar
            totalAmount += amount * product.quantity;

            
            // away stripe dayawet loy return bkain pewesta nawi propkan haman naw bet
            return {
                price_data:{
                     currency: "usd",
                     product_data: {
                        name: product.name,
                        image: [product.image], 
                     },
                     unit_amount: amount,
                }
            }

        });


        let coupon = null;

        // agar coupon ka buni habu pashan dallayn koy aw hamu productakanay ka hamana
        // jarani rezhay discount ka bka dabashi 100 bka chand darchu aw raqamay kami totalAmount bka
        // labar awasha esta checke coupon dakain chunka esta totalAmount man la dasta
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true});
            if (coupon) {
                totalAmount -= Math.round( totalAmount * coupon.discountPercentage / 100);
            }
        }

        
        // dast ba drust krdni session ka dakain loy
        // lera checkout sessionakay drust dakain w pey dallain ka dabi kubet
        const session = await stripe.checkout.sessions.create({
          // jore paradan
          payment_method_types: ['card'],
          // productakan man
          line_items: lineItems,
          // jorakay para dan bet yan nmuna subscription be
          mode: 'payment',
          // agar shatakan tawaw bu awa user bbayna chendar
          // http//localhost:5173 aw duwa lo developmenta ka chuwa production awha nabet
          success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          // agar user cancel krdawa
          cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
          // lera agar discount man habu dawaman le daka array bet
          // agar coupon ka buni habu awa larey aw functiona ama 
          // ama rezhay discountakay lo danern 
          // agaresh nabu awa empty arrayake lo danerenawa
          discounts: coupon 
          ? [ { coupon: await createStripeCoupon(coupon.discountPercentage)} ]
          : [],
          //lera ama userId w coupon w productakan ka krayna la metadata da danyen
          //kahar produckatak la 3 sht pek det w dabet ba string lawe daynen
          metadata: {
            userId: req.user._id.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(
                products.map((p) => ({
                    id: p._id,
                    quantity: p.quantity,
                    price: p.price,
                }))
            )
          },
          amount_total: totalAmount,
        });

        if ( totalAmount >= 20000) {
          await createNewCoupon(req.user._id);
        }


        res.status(200).json({
          id:  session.id,
          totalAmount: totalAmount / 100,
        })
    } catch (error) {
        console.log("Error in createCheckoutSession controller")
    }
}


// coupon ke nwe drust dakain nmuna 
// agar user la 200 dolar zyatr bkret ama 10% ba hadia pe dadayn lo qlashka
async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    userId: userId,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60  * 1000)
  });

  // aw coupona save ka la db
  await newCoupon.save();
}


// kari away tanha awaya ka couponak lo stripe drust bkat w hata discountaka apply bkret
async function  createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: 'once',
  });

  return coupon.id;
}


// safe way for price
/*import Product from "../models/product.model.js";

const lineItems = await Promise.all(
  products.map(async (item) => {
    const product = await Product.findById(item.id);

    if (!product) {
      throw new Error("Product not found");
    }

    const amount = Math.round(product.price * 100);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name
        },
        unit_amount: amount
      },
      quantity: item.quantity
    };
  })
);
*/







//checkout success


export const checkoutSuccess = async (req, res) => {
  try {
    // lera user sessionId kaman lo danertawa
    const { sessionId } = req.body;
    
    // tamsha dakain bzamim aw sessionId buni haya  
    const session = await stripe.checkout.session.retrieve(sessionId);


    // tamsha dakain aya paraka draya
    if (session.payment_status === "paid") {
      // lera tamsha dakain bzanin aya coupon bakar hatya leraya ka eshman ba metadata dabtawa katak ama lawe
      // userId w chand shtak man lagal dana esta la regay awana la session kay dawa dakynawa
      if (session.metadata.couponCode) {
        // madam haya awa deactivate dakain lo aw userman
        // la du bash pek det away kam ka dabi aw marjana teda bet duwam awhaman lo bkat
        await Coupon.findOneAndUpdate({ code: session.metadata.couponCode, userId: session.metadata.userId, isActive: true},
          { isActive: false}
        );
      }
    }

    // drut krdni orderak
    // labar away ba string store man krd lera parse dakibawa lo atyadi
    const products = JSON.parse(session.metadata.products)
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      stripSessionId: session.id
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Payment Successful, order created, and coupon deactivated if used",
      orderId: newOrder._id,
    })

  } catch (error) {
    console.log("Error in checkoutSuccess controller", error.message);
    res.status(500).json({ message: "Error in server", error: error.message});
  }
}

