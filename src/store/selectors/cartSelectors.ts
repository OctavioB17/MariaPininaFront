import { RootState } from "..";
import { ICartItem } from "../../interfaces/ICart";
import { IOrder } from "../../interfaces/ICart";

export const selectCartOrders = (state: RootState) => state.cart.orders;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartItemCount = (state: RootState) => 
    state.cart.orders.reduce((total: number, order: IOrder) => 
        total + order.items.reduce((orderTotal: number, item: ICartItem) => orderTotal + item.quantity, 0), 
    0); 