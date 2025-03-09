import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

export type Hero = {
  name: string;
  url: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
};

export interface SelectedHeroes {
  items: Hero[];
  selectedCharacter: Hero | null;
  isLoading: boolean;
}

const initialState: SelectedHeroes = {
  items: [],
  selectedCharacter: null,
  isLoading: false,
};

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<Hero>) => {
      if (!state.items.find((item) => item.name === action.payload.name)) {
        state.items.push(action.payload);
      }
    },
    unselectItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
    },
    unselectAll: (state) => {
      state.items = [];
    },
    selectCharacterDetail: (state, action: PayloadAction<Hero | null>) => {
      state.selectedCharacter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  selectItem,
  unselectItem,
  unselectAll,
  selectCharacterDetail,
  setLoading,
} = selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;

export const selectSelectedItems = createSelector(
  (state: { selectedItems: SelectedHeroes }) => state.selectedItems.items,
  (items) => [...items]
);

export const selectCharacter = createSelector(
  (state: { selectedItems: SelectedHeroes }) =>
    state.selectedItems.selectedCharacter,
  (selectedCharacter) => (selectedCharacter ? { ...selectedCharacter } : null)
);

export const selectIsLoading = createSelector(
  (state: { selectedItems: SelectedHeroes }) => state.selectedItems.isLoading,
  (isLoading) => Boolean(isLoading)
);
