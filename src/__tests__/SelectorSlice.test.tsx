import selectedItemsReducer, {
  selectItem,
  unselectItem,
  unselectAll,
  selectCharacterDetail,
  setLoading,
  selectSelectedItems,
  selectCharacter,
  selectIsLoading,
  Hero,
  SelectedHeroes,
} from '../features/selector/SelectorSlice';

describe('selectedItemsSlice Reducer', () => {
  let initialState: SelectedHeroes;

  beforeEach(() => {
    initialState = {
      items: [],
      selectedCharacter: null,
      isLoading: false,
    };
  });

  test('should return the initial state', () => {
    expect(selectedItemsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('should handle selectItem', () => {
    const hero: Hero = {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    };

    const newState = selectedItemsReducer(initialState, selectItem(hero));

    expect(newState.items).toEqual([hero]);
  });

  test('should not add duplicate items', () => {
    const hero: Hero = {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    };

    initialState.items = [hero];

    const newState = selectedItemsReducer(initialState, selectItem(hero));

    expect(newState.items).toEqual([hero]);
  });

  test('should handle unselectItem', () => {
    const hero1: Hero = {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    };
    const hero2: Hero = {
      name: 'Darth Vader',
      url: 'https://swapi.dev/api/people/4/',
    };

    initialState.items = [hero1, hero2];

    const newState = selectedItemsReducer(
      initialState,
      unselectItem('Luke Skywalker')
    );

    expect(newState.items).toEqual([hero2]);
  });

  test('should handle unselectAll', () => {
    initialState.items = [
      { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      { name: 'Darth Vader', url: 'https://swapi.dev/api/people/4/' },
    ];

    const newState = selectedItemsReducer(initialState, unselectAll());

    expect(newState.items).toEqual([]);
  });

  test('should handle selectCharacterDetail', () => {
    const character: Hero = {
      name: 'Yoda',
      url: 'https://swapi.dev/api/people/20/',
    };

    const newState = selectedItemsReducer(
      initialState,
      selectCharacterDetail(character)
    );

    expect(newState.selectedCharacter).toEqual(character);
  });

  test('should handle setLoading', () => {
    const newState = selectedItemsReducer(initialState, setLoading(true));

    expect(newState.isLoading).toBe(true);
  });

  test('should select selected items from state', () => {
    const state = {
      selectedItems: {
        items: [
          { name: 'Leia Organa', url: 'https://swapi.dev/api/people/5/' },
        ],
        selectedCharacter: null,
        isLoading: false,
      },
    };

    expect(selectSelectedItems(state)).toEqual(state.selectedItems.items);
  });

  test('should select selected character from state', () => {
    const state = {
      selectedItems: {
        items: [],
        selectedCharacter: {
          name: 'Obi-Wan Kenobi',
          url: 'https://swapi.dev/api/people/10/',
        },
        isLoading: false,
      },
    };

    expect(selectCharacter(state)).toEqual(
      state.selectedItems.selectedCharacter
    );
  });

  test('should select isLoading from state', () => {
    const state = {
      selectedItems: {
        items: [],
        selectedCharacter: null,
        isLoading: true,
      },
    };

    expect(selectIsLoading(state)).toBe(true);
  });
});
