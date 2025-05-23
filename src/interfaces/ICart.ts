import { IProductWithUserAndCategory } from './IProducts';

export interface ICartItem {
    product: IProductWithUserAndCategory;
    quantity: number;
}

export interface IOrder {
    sellerId: string;
    sellerName: string;
    items: ICartItem[];
    total: number;
}

export interface ICartState {
    orders: IOrder[];
    loading: boolean;
    error: string | null;
} 