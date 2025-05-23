import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICartItem, ICartState } from '../../interfaces/ICart';

const initialState: ICartState = {
    items: [],
    total: 0,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ICartItem>) => {
            const existingItem = state.items.find(
                item => item.product.id === action.payload.product.id
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            state.total = state.items.reduce(
                (total, item) => total + (item.product.price * item.quantity),
                0
            );
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                item => item.product.id !== action.payload
            );
            state.total = state.items.reduce(
                (total, item) => total + (item.product.price * item.quantity),
                0
            );
        },
        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.items.find(
                item => item.product.id === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
                state.total = state.items.reduce(
                    (total, item) => total + (item.product.price * item.quantity),
                    0
                );
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setLoading,
    setError
} = cartSlice.actions;

export default cartSlice.reducer; 