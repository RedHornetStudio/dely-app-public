import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    businessUserSignIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    businessUserSignOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
    businessUserAccessTokenUpdated: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { businessUserSignIn, businessUserSignOut, businessUserAccessTokenUpdated } = authSlice.actions;
export default authSlice;