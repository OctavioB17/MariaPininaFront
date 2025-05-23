import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICartItem, ICartState, IOrder } from '../../interfaces/ICart';

const loadState = (): ICartState => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return {
        orders: [],
        loading: false,
        error: null
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return {
      orders: [],
      loading: false,
      error: null
    };
  }
};

const initialState: ICartState = loadState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ICartItem>) => {
            const { product, quantity } = action.payload;
            const sellerId = product.userId;
            const sellerName = `${product.user.name} ${product.user.surname}`;

            const existingOrderIndex = state.orders.findIndex(
                order => order.sellerId === sellerId
            );

            if (existingOrderIndex !== -1) {
                const existingItemIndex = state.orders[existingOrderIndex].items.findIndex(
                    item => item.product.id === product.id
                );

                if (existingItemIndex !== -1) {
                    state.orders[existingOrderIndex].items[existingItemIndex].quantity += quantity;
                } else {
                    state.orders[existingOrderIndex].items.push({ product, quantity });
                }

                state.orders[existingOrderIndex].total = state.orders[existingOrderIndex].items.reduce(
                    (total, item) => total + (item.product.price * item.quantity),
                    0
                );
            } else {
                const newOrder: IOrder = {
                    sellerId,
                    sellerName,
                    items: [{ product, quantity }],
                    total: product.price * quantity
                };
                state.orders.push(newOrder);
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<{ sellerId: string; productId: string }>) => {
            const { sellerId, productId } = action.payload;
            const orderIndex = state.orders.findIndex(order => order.sellerId === sellerId);

            if (orderIndex !== -1) {
                state.orders[orderIndex].items = state.orders[orderIndex].items.filter(
                    item => item.product.id !== productId
                );

                state.orders[orderIndex].total = state.orders[orderIndex].items.reduce(
                    (total, item) => total + (item.product.price * item.quantity),
                    0
                );

                if (state.orders[orderIndex].items.length === 0) {
                    state.orders.splice(orderIndex, 1);
                }
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (state, action: PayloadAction<{ sellerId: string; productId: string; quantity: number }>) => {
            const { sellerId, productId, quantity } = action.payload;
            const orderIndex = state.orders.findIndex(order => order.sellerId === sellerId);

            if (orderIndex !== -1) {
                const itemIndex = state.orders[orderIndex].items.findIndex(
                    item => item.product.id === productId
                );

                if (itemIndex !== -1) {
                    state.orders[orderIndex].items[itemIndex].quantity = quantity;
                    state.orders[orderIndex].total = state.orders[orderIndex].items.reduce(
                        (total, item) => total + (item.product.price * item.quantity),
                        0
                    );
                }
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter(order => order.sellerId !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearAllOrders: (state) => {
            state.orders = [];
            localStorage.setItem('cart', JSON.stringify(state));
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearCart: (state) => {
            state.orders = [];
            localStorage.setItem('cart', JSON.stringify(state));
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearOrder,
    clearAllOrders,
    setLoading,
    setError,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer; 