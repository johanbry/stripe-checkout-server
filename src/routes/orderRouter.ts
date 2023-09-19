import { Router } from "express";

import { createOrder } from "../controllers/orderController";

const orderRouter = Router().post("/", createOrder);

export default orderRouter;
