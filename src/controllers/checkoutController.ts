import { Request, Response } from "express";

import initStripe from "../stripe/stripe";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  default_price: {
    id: string;
    unit_amount: number;
  };
  images: string[];
}

export interface ICartItem extends IProduct {
  qty: number;
}

export const createStripeCheckoutSession = async (
  req: Request,
  res: Response
) => {
  try {
    const stripe = initStripe();

    // Create Stripe Checkout with supplied cart items and customer.
    const session = await stripe?.checkout.sessions.create({
      line_items: req.body.cart.map((item: ICartItem) => {
        return {
          price: item.default_price.id,
          quantity: item.qty,
        };
      }),
      customer: req.body.customer,
      allow_promotion_codes: true,
      mode: "payment",
      success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    if (!session)
      return res.status(500).json({ message: "Could not connect to Stripe." });

    // Return session checkout url.
    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error connecting to Stripe." });
  }
};
