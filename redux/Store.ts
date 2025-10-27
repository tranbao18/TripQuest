import { configureStore } from "@reduxjs/toolkit";
import userReducer from './Slices/UserSlice';
import tourReducer from "./Slices/tourSlice";
import bookingReducer from "./Slices/bookingSlice";
import couponReducer from "./Slices/couponSlice";
import favoriteReducer from './Slices/FavoriteSlice';

export const Store = configureStore({
    reducer: {
        user: userReducer,
        tours: tourReducer,
        bookings: bookingReducer,
        coupons: couponReducer,
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;