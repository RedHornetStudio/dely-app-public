import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import AppRoot from './navigators/AppRoot';
import appSettingsSlice from './features/appSettingsSlice';
import favoriteShopsSlice from './features/favoriteShopsSlice';

const rootReducer = combineReducers({
  appSettingsSlice: appSettingsSlice.reducer,
  favoriteShopsSlice: favoriteShopsSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default function App() {
  return (
    <Provider store={store}>
      <AppRoot />
    </Provider>
  );
}
