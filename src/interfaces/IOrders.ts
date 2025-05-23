import { IProduct, IProductWithUserAndCategory } from "./IProducts";
import { IUser } from "./IUser";

export interface Order {
    id: string;
    status: string;
    totalPrice: number;
    paymentMethod: string;
    taxes: Taxes[];
    products: IProduct[];
    user: IUser;
    userId: string;
}

export interface IOrder {
    sellerId: string;
    sellerName: string;
    items: IOrderItem[];
    total: number;
  } 

export interface Taxes {
  type: string;
  number: number
}

export interface IOrderItem {
    product: IProductWithUserAndCategory;
    quantity: number;
  }

export interface OrderProduct {
    productId: string;
    quantity: number;
}
  
export interface OrderData {
    order: {
      paymentMethod: string;
    };
    orderHasProducts: OrderProduct[];
}
  