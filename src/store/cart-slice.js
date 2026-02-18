import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

const FIREBASE_URI = import.meta.env.VITE_FIREBASE_URI

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalQuantity: 0,
        changed: false
    },
    reducers: {
        replaceCart(state, action) {
            state.totalQuantity = action.payload.totalQuantity;
            state.items = action.payload.items;
        },
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);
            state.totalQuantity++;
            state.changed = true;
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);
            state.totalQuantity--;
            state.changed = true
            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }
        },
    },
});

export const sendCartData = (cart) => {
    return async (dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'pending',
            message: 'Sending Cart Data'
        }))

        const sendCartData = async () => {

            const response = await fetch('firebase_uri', {
                method: "PUT",
                body: JSON.stringify(cart)
            })

            if (!response.ok) {
                throw new Error('Sending cart Data failed')
            }
        }

        try {
            await sendCartData()
            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'success',
                message: 'Sent Cart Data Successfully'
            }))
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'error',
                message: 'Sending Cart Data failed'
            }))
        }
    }
}

export const fetchCartData = () => {
    return async (dispatch) => {

        const fetchData = async () => {

            const response = await fetch(`firebase_uri`)

            if (!response.ok) {
                throw new Error('fetching cart Data failed')
            }

            const data = await response.json();

            return data
        }

        try {
            const cartData = await fetchData()
            dispatch(cartActions.replaceCart(cartData))
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'error',
                message: 'fetching Cart Data failed'
            }))
        }
    }
}

export const cartActions = cartSlice.actions;

export default cartSlice;