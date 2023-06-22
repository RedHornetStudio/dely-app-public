import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { StatusBar } from 'expo-status-bar';

import AppRoot from './navigators/AppRoot';
import appSettingsSlice from './features/appSettingsSlice';
import favoriteShopsSlice from './features/favoriteShopsSlice';
import shoppingCartSlice from './features/shoppingCartSlice';
import authSlice from './features/authSlice';
import ordersFiltersSlice from './features/ordersFiltersSlice';
import ordersHistorySlice from './features/ordersHistorySlice';
import contactInfoSlice from './features/contactInfoSlice';
import googleMobileAdsSlice from './features/googleMobileAdsSlice';

const rootReducer = combineReducers({
  appSettingsSlice: appSettingsSlice.reducer,
  favoriteShopsSlice: favoriteShopsSlice.reducer,
  shoppingCartSlice: shoppingCartSlice.reducer,
  authSlice: authSlice.reducer,
  ordersFiltersSlice: ordersFiltersSlice.reducer,
  ordersHistorySlice: ordersHistorySlice.reducer,
  contactInfoSlice: contactInfoSlice.reducer,
  googleMobileAdsSlice: googleMobileAdsSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default function App() {
  return (
    <Provider store={store}>
      <AppRoot />
      <StatusBar style="light" backgroundColor="#00000000" translucent={true} />
    </Provider>
  );
}