import { createSlice } from "@reduxjs/toolkit";

const ordersFiltersSlice = createSlice({
  name: 'ordersFilters',
  initialState: {
    ordersFilters: '["preparing", "ready"]',
  },
  reducers: {
    ordresFiltersChanged: (state, action) => {
      state.ordersFilters = action.payload;
    }
  },
});

export const { ordresFiltersChanged } = ordersFiltersSlice.actions;
export default ordersFiltersSlice;