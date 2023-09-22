import { Router } from "express";

import { createStripeCheckoutSession } from "../controllers/checkoutController";
import { auth } from "../middleware/middleware";

const checkoutRouter = Router().post(
  "/create-stripe-session",
  auth,
  createStripeCheckoutSession
);

export default checkoutRouter;
