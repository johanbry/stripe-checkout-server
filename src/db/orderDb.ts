import { readParseJSONFile, saveJSONFile } from ".";
import { IOrder } from "../interfaces/interfaces";

const ORDERS_FILE = "data/orders.json";

export const saveOrders = async (orders: IOrder[]) => {
  try {
    saveJSONFile(ORDERS_FILE, orders);
  } catch (error) {
    throw error;
  }
};

export const readOrders = async (): Promise<IOrder[] | null> => {
  try {
    let orders: IOrder[] | null = null;
    orders = await readParseJSONFile(ORDERS_FILE);
    return orders;
  } catch (error) {
    throw error;
  }
};
