import { Router } from "express";
import {
  getProducts,
  getProductsActive,
  getProductsInaActive,
  getProduct,
  getProductCategory,
  getSalesReport,
  getProductInventory,
  createProducts,
  updateProducts,
  deleteProducts,
  restoreProducts,
} from "../controllers/product.controllers.js";

const router = Router();

router.get("/productsAll", getProducts);
router.get("/products", getProductsActive);
router.get("/productsI", getProductsInaActive);
router.get("/product/:id", getProduct);
router.get("/product/category/:id", getProductCategory);
router.get("/salesReport", getSalesReport);
router.get("/product/:id/inventory", getProductInventory);
router.post("/product", createProducts);
router.put("/product/:id", updateProducts);
router.delete("/product/:id", deleteProducts);
router.delete("/productRestore/:id", restoreProducts);

export default router;
