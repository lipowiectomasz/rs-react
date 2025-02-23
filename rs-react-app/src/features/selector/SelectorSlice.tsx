import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

export type Hero = {
  name: string;
  url: string;
};

export interface SelectedHeroes {
  items: Hero[];
}

const initialState: SelectedHeroes = {
  items: [],
};

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    selectItem: (state, action) => {
      if (!state.items.find((item) => item.name === action.payload.name)) {
        state.items.push(action.payload);
      }
    },
    unselectItem: (state, action) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
    },
    unselectAll: (state) => {
      state.items = [];
    },
  },
});

export const { selectItem, unselectItem, unselectAll } =
  selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;

export const selectSelectedItems = createSelector(
  (state: { selectedItems: SelectedHeroes }) => state.selectedItems.items,
  (items) => items
);
