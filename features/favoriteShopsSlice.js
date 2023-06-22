import { createSlice } from "@reduxjs/toolkit";

const favoriteShopsSlice = createSlice({
  name: 'favoriteShops',
  initialState: {
    favoriteShops: '[]',
  },
  reducers: {
    favoriteShopsChanged: (state, action) => {
      state.favoriteShops = action.payload;
    }
  },
});

export const { favoriteShopsChanged } = favoriteShopsSlice.actions;
export default favoriteShopsSlice;