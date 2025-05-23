import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/index';
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearOrder,
    clearAllOrders,
} from '../store/slices/cartSlice';
import { IProductWithUserAndCategory } from '../interfaces/IProducts';

export const useCart = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state: RootState) => state.cart.orders);
    const loading = useSelector((state: RootState) => state.cart.loading);
    const error = useSelector((state: RootState) => state.cart.error);

    const addItem = (product: IProductWithUserAndCategory, quantity: number = 1) => {
        dispatch(addToCart({ product, quantity }));
    };

    const removeItem = (sellerId: string, productId: string) => {
        dispatch(removeFromCart({ sellerId, productId }));
    };

    const updateItemQuantity = (sellerId: string, productId: string, quantity: number) => {
        dispatch(updateQuantity({ sellerId, productId, quantity }));
    };

    const clearSellerOrder = (sellerId: string) => {
        dispatch(clearOrder(sellerId));
    };

    const clearAll = () => {
        dispatch(clearAllOrders());
    };

    const getOrderBySeller = (sellerId: string) => {
        return orders.find(order => order.sellerId === sellerId);
    };

    const getTotalItems = () => {
        return orders.reduce((total, order) => 
            total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0), 
        0);
    };

    const getTotalAmount = () => {
        return orders.reduce((total, order) => total + order.total, 0);
    };

    return {
        orders,
        loading,
        error,
        addItem,
        removeItem,
        updateItemQuantity,
        clearSellerOrder,
        clearAll,
        getOrderBySeller,
        getTotalItems,
        getTotalAmount,
    };
}; 