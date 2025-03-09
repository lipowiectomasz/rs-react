import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selector/SelectorSlice';
import { starWarsApi } from '../features/api/starWarsApi';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [starWarsApi.reducerPath]: starWarsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(starWarsApi.middleware),
});
