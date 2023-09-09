import Router from "express";
import { getProducts } from "../controllers/productController";

const productRouter = Router().get("/", getProducts);

export default productRouter;
