import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selector/SelectorSlice';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
  },
});
