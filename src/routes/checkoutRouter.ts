import { Router } from "express";

import { createStripeCheckoutSession } from "../controllers/checkoutController";

const checkoutRouter = Router().post(
  "/create-stripe-session",
  createStripeCheckoutSession
);

export default checkoutRouter;
