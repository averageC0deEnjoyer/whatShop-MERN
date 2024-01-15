export const addDecimals = (number) => {
  return (Math.round(number * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((a, i) => a + i.price * i.qty, 0)
  );
  //calculate shipping price (if order is 100, free, else 10 shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  //calculate tax price (example 15%)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
  //calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));
};
