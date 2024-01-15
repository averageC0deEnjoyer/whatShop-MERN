import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      //new/updated data
      const enteredItem = action.payload;
      //old data if exist
      const existItem = state.cartItems.find(
        (item) => item._id === enteredItem._id
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((item) =>
          item._id === existItem._id ? enteredItem : item
        );
      } else {
        state.cartItems = [...state.cartItems, enteredItem];
      }
      // return the processed state or final state.
      // we processed the cartState by adding totalPrice , shipping price, tax price, allTotalPrice(included shipping and tax)
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const { id: productId } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== productId
      );
      return updateCart(state);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
