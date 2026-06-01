import Product from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllProducts = async (req, res) => {
try {
    // hamu productakan lo bang bka
    const products = await Product.find({});
    
    res.status(200).json(products);
} catch (error) {
    console.error("Something went wrong at getAllproducts", error.message);
    res.status(500).json({message:"Something went wrong at getAllproducts", error:error.message});
}
}

export const getFeaturedProducts = async (req, res) => {
    try {
        //yakam jar check dakain aya buni haya la redis
        let featuredProducts = await redis.get('featured_products');

        // agar habu
        if (featuredProducts) {
            // parse dakain labar away baxoy stringa 
            return res.json(JSON.parse(featuredProducts));
        }

        // agar buni nabu awa la DB e products dagaren
        // agaresh habu awa rek dayxina let e featuredProducts
        // lean() eshe awaya la jyate return krdni MongoDB Obj 
        // ba javascript return dakat ka zor sare3 tra
        featuredProducts = await Product.find({isFeatured: true}).lean();

        //agar la DB esh nabu
        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured product found"});
        }

        //agaresh habu la db ama dayn lo jare dabet la redis day daneyn
        // stringify dakain chunka tanha string war dagret sare3 tra
        await redis.set('featured_products', JSON.stringify(featuredProducts));
        

        //kota sht ka featured products return dakain
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        return res.status(500).json({ message: "Server Error", error: error.message});
    }
}


export const createProduct = async (req, res) => {
    try {
        // sarata data la user wardagrin
        const {name, description, price, image, category} = req.body;
        
        // bashewaki kati daykayna null
        let cloudinaryResponse = null;

        // agar image buni habu awa ahwa bka
        if (image) {
            // awa rsmakay lawe store dakain image dadayne yakam jar
            // pashan nawe folder kay dyare dakain chbet
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products"})
        }

        // pashan product kay drust dakain la DB
        const product = await Product.create({
            name: name,
            description: description,
            price, price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category: category 
        });


        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProducts controller", error.message);
        return res.status(500).json({ message: "Server Error", error: error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        // yakam jar product dabinawa laregay params id
        const product = await Product.findById(req.params.id);

        // agar buni nabu
        if (!product) {
            return res.status(404).json({ message: "Product not found"});
        }

        // agar rsme habu
        if (product.image) {
            // sarata pewesta id aw rsma bzanin hata rek aw rash kaynawa
            // amash ID kayman la DB save krdbu
            // yakam jar stringka kaml split dakain la / pashan 
            // kota item lanaw array dabain pashan . teda nahelin 
            // kotasht yakam index war dagrin ka dabeta id ka
            const publicId = product.image.split("/").pop().split(".")[0];
            // labar away ama la foldere products store man krdya
            // pewesta nawi folder bnusin pashani id kay pe bdanin
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log(" Deleted from Cloudinary");
            } catch (error) {
                console.log("Error in deleting cloudinary image", error.message);
            }
        }

        // kota sht dubara find dakain w lagali delete dakain
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully"});        
    } catch (error) {
            console.log("Error in deleteProduct controller", error.message);
            res.status(500).json({ message: "Serer Error",  error: error.message })
    }

}



export const getRecommendedProducts = async (req, res) => {
    try {

        const products = await Product.aggregate([
            { // bashewaki random 3 dana halbzhera
                $sample: {size:3}
            },
            { // tanha aw field bhena ka lera da haya 1 ba manay include det 0esh exclude
              
                $project: {
                    name: 1, 
                    description: 1, 
                    price: 1,
                    image: 1, 
                    category: 1 
                }
            }
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts", error.message);
        res.status(500).json({ message: "Server Error", error: error.message});
    }


}


export const getProductsByCategory = async (req, res) => {
    try {   
    const category = await Product.find({ category: req.params.category});

    res.json(category);

    } catch (error) {
    console.log("Error in getProductsByCategory", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });        
    }
}


async function updateFeaturedProductsCache() {
    try {
        // hamu awa productanay ka truen (lean Returns plain JS objects instead of full mongoose documents.)
        const featuredProducts = await Product.find({ isFeatured: true }).lean(); 
        // replace krdni konakan ba haman sht ballam zyad krdni nweyaka lagali
        redis.set('featured_products', JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache");
    }
}


export const toggleFeaturedProduct = async (req, res) => {
    try {
        //detnaway productka
        const product = await Product.findById(req.params.id);

        //agar buni habu
        if (product) {
            // har ch bu pechawanay xoy
            product.isFeatured = !product.isFeatured;
            // save bka la db w return bkawa 
            const updatedProduct = await product.save();
            // lo update krdni catch kaman  
            await updateFeaturedProductsCache();
            return res.json(updatedProduct);
        } else {
            return res.status(404).json({ message: "Product not found to feature"});
        }

    } catch (error) {
        console.log("Error in toggleFeaturedProduct", error.message);
        res.status(500).json({ message: "Server Error", error: error.message});
    }
} 