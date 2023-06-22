import { createSlice } from "@reduxjs/toolkit";

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState: {
    ordersHistory: '[]',
  },
  reducers: {
    ordersHistoryChanged: (state, action) => {
      state.ordersHistory = action.payload;
    }
  },
});

export const { ordersHistoryChanged } = ordersHistorySlice.actions;
export default ordersHistorySlice;