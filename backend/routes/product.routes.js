import express from 'express';
import { createProduct, getAllProducts, getFeaturedProducts } from '../controllers/product.controllers.js';
import { adminRoute, protectRoute } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protectRoute, adminRoute, createProduct);

export default router;