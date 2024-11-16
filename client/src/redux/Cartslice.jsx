import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addCartProduct(state, action) {
      state.cartItems = action.payload; 
    },
    removeProduct(state, action) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
});

export const { addCartProduct, removeProduct, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
