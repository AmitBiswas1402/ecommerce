import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js"


export const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.log("Error is getAllProducts", error);
        res.status(500).json({ message: error.message });
    }
}

export const getFeaturedProducts = async(req, res) => {
    try {
        let featuredOnes = await redis.get("featured_products");
        if (featuredOnes) {
            return res.json(JSON.parse(featuredOnes))
        }

        const featuredProducts = await Product.find({ isFeatured: true }).learn();

        if (!featuredProducts) {
            return res.status(404).json({message: "No featured products found"})
        }
        
        await redis.set("featured_products", JSON.parse(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error is getFeaturedProducts", error);
        res.status(500).json({ message: error.message });        
    }
}

export const createProduct = async(req, res) => {
    try {
        const {name, description, price, image, category} = req.body;

        let cloudResponse = null;

        if (image) {
            cloudResponse = await cloudinary.uploader.upload(image, {folder: "products"})
        }

        const product = new Product({
            name,
            description,
            price,
            image: cloudResponse?.secure_url ? cloudResponse.secure_url : "",
            category
        });

        res.status(201).json(product)
    } catch (error) {
        console.log("Error is createProduct", error);
        res.status(500).json({ message: error.message });        
    }
}