// export interface IClientUser {
//   stripeId: string | Stripe.Customer | Stripe.DeletedCustomer | null;
//   name: string | undefined | null;
//   email: string | undefined | null;
// }
export interface IClientUser {
  stripeId: string;
  name: string;
  email: string;
}
export interface IServerUser extends IClientUser {
  password: string;
}

export interface IOrder {
  id: string;
  created: number;
  paymentId: string;
  customer: IClientUser;
  totalAmount: number;
  orderItems: (IOrderItem | undefined)[];
}

export interface IOrderItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  discount: number;
  totalPrice: number;
}

export interface IRegisterValidationUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
