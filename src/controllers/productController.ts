import { Request, Response } from "express";
import initStripe from "../stripe/stripe";

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Get products from Stripe, limit to specified number (or 10) and expand the default_price property.
    const stripe = initStripe();
    const limit: number = Number(req.query.limit) || 10;
    const products = await stripe?.products.list({
      limit,
      expand: ["data.default_price"],
    });
    if (!products) return res.status(204).end();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json("Error when retrieving products. " + error);
  }
};
