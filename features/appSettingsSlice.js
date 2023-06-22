import { createSlice } from "@reduxjs/toolkit";

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState: {
    appLanguage: 'en',
    country: 'latvia',
  },
  reducers: {
    appLanguageChanged: (state, action) => {
      state.appLanguage = action.payload;
    },
    countryChanged: (state, action) => {
      state.country = action.payload;
    }
  },
});

export const { appLanguageChanged, countryChanged } = appSettingsSlice.actions;
export default appSettingsSlice;