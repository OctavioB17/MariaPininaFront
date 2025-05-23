import { RootState } from "../store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartItemCount = (state: RootState) => 
    state.cart.items.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0); 