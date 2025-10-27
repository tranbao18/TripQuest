import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.push(action.payload);
    },
    removeBooking: (state, action) => {
      return state.filter((b) => b.id !== action.payload);
    },
    clearBookings: () => {
      return [];
    },
  },
});

export const { addBooking, removeBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;