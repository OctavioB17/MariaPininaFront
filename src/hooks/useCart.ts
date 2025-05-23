import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} from '../store/slices/cartSlice';
import { IProduct } from '../interfaces/IProducts';

export const useCart = () => {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.cart.items);
    const total = useSelector((state: RootState) => state.cart.total);
    const loading = useSelector((state: RootState) => state.cart.loading);
    const error = useSelector((state: RootState) => state.cart.error);

    const addItem = (product: IProduct, quantity: number = 1) => {
        dispatch(addToCart({ product, quantity }));
    };

    const removeItem = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const updateItemQuantity = (productId: string, quantity: number) => {
        dispatch(updateQuantity({ productId, quantity }));
    };

    const clear = () => {
        dispatch(clearCart());
    };

    return {
        items,
        total,
        loading,
        error,
        addItem,
        removeItem,
        updateItemQuantity,
        clear,
    };
}; 