import Router from "express";
import { getAllProducts } from "../controllers/productController";

const productRouter = Router().get("/", getAllProducts);

export default productRouter;
