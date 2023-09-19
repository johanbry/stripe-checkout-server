import { IOrder } from "../interfaces/interfaces";
import { readOrders } from "../db/orderDb";

export const getOrdersByUser = async (
  userId: string
): Promise<IOrder[] | null> => {
  try {
    let orders: IOrder[] = (await readOrders()) || [];
    const userOrders = orders.filter(
      (order) => order.customer.stripeId === userId
    );

    return userOrders;
  } catch (error) {
    throw error;
  }
};
