import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };

const addDecimals = (number) => {
  return (Math.round(number * 100) / 100).toFixed(2);
};

console.log(initialState);

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

      //calculate items price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((a, i) => a + i.price * i.qty, 0)
      );
      //calculate shipping price (if order is 100, free, else 10 shipping)
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
      //calculate tax price (example 15%)
      state.taxPrice = addDecimals(
        Number((0.15 * state.itemsPrice).toFixed(2))
      );
      //calculate total price
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
