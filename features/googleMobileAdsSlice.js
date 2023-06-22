import { createSlice } from "@reduxjs/toolkit";

const googleMobileAdsSlice = createSlice({
  name: 'googleMobileAds',
  initialState: {
    adIsInitialized: false,
  },
  reducers: {
    initializationStatusChanged: (state, action) => {
      state.adIsInitialized = action.payload;
    },
  },
});

export const { initializationStatusChanged } = googleMobileAdsSlice.actions;
export default googleMobileAdsSlice;