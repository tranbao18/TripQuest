import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coupons: [],
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setCoupons: (state, action) => {
      state.coupons = action.payload;
    },
    decrementCoupon: (state, action) => {
      const coupon = state.coupons.find(c => c.code === action.payload);
      if (coupon && coupon.max_uses > 0) {
        coupon.max_uses -= 1;
      }
    },
  },
});

export const { setCoupons, decrementCoupon } = couponSlice.actions;
export default couponSlice.reducer;