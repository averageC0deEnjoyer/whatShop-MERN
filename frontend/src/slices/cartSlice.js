import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

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
    },
    removeFromCart: (state, action) => {
      const { id: productId } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== productId
      );
      // we have to return the final state
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
