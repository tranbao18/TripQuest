import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tours: [],
  page: 1,
  totalPages: 1,
};

const tourSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setTours: (state, action) => {
      state.tours = action.payload.tours;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },
  },
});

export const { setTours } = tourSlice.actions;
export default tourSlice.reducer;