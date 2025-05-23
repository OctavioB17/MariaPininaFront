import { IProduct } from './IProducts';

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface ICartState {
    items: ICartItem[];
    total: number;
    loading: boolean;
    error: string | null;
} 