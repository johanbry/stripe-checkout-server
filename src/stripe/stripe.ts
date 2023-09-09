import Stripe from "stripe";

const initStripe = () => {
  const stripeKey = process.env.STRIPE_API_KEY;
  if (!stripeKey) return;
  return new Stripe(stripeKey, {
    apiVersion: "2023-08-16",
  });
};

export default initStripe;
