import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import initStripe from "../stripe/stripe";
import { IOrderItem, IOrder } from "../interfaces/interfaces";
import { readOrders, saveOrders } from "../db/orderDb";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const sessionId: string = req.body.stripeSessionId;
    if (!sessionId) return res.status(400).json({ message: "No session id." });

    // Verify Stripe payment session exists and is paid before creating new order
    const stripe = initStripe();

    if (!stripe)
      return res.status(500).json({ message: "Could not connect to Stripe." });

    const session = await stripe?.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid")
      return res.status(400).json({ message: "Payment not verified." });

    // Create new order object
    const lineItems = await stripe?.checkout.sessions.listLineItems(sessionId);

    if (!lineItems) return res.status(400).json({ message: "Empty order." });

    const orderItems = Promise.all(
      lineItems.data.map(async (item) => {
        if (item.price) {
          const product = await stripe?.products.retrieve(
            item.price.product.toString()
          );
          if (
            product &&
            item.price.product.toString() &&
            item.price.unit_amount &&
            item.quantity
          ) {
            const orderItem: IOrderItem = {
              id: item.price.product.toString(),
              name: product?.name,
              image: product?.images[0],
              price: item.price.unit_amount,
              quantity: item.quantity,
              discount: item.amount_discount,
              totalPrice: item.amount_total,
            };

            return orderItem;
          }
        }
      })
    );

    let newOrder: IOrder | null = null;
    if (
      orderItems &&
      session.customer &&
      session.customer_details?.name &&
      session.customer_details.email
    ) {
      newOrder = {
        id: uuidv4(),
        created: session.created,
        paymentId: sessionId,
        totalAmount: session.amount_total || 0,
        customer: {
          stripeId: session.customer.toString(),
          name: session.customer_details?.name,
          email: session.customer_details?.email,
        },
        orderItems: await orderItems,
      };
    }

    let orders: IOrder[] = (await readOrders()) || [];

    // Check if order with this payment id (Stripe session id) already exists
    const existingOrder: IOrder | undefined = orders.find(
      (order) => order.paymentId === sessionId
    );
    if (existingOrder)
      return res
        .status(200)
        .json({ message: "Order already exists.", data: existingOrder });

    // Add and save new order.
    if (newOrder) {
      orders.push(newOrder);
    }

    await saveOrders(orders);

    res
      .status(201)
      .json({ message: "Order successfully created.", data: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error veryfying and creating order: " + error,
    });
  }
};
