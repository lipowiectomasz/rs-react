import { configureStore } from '@reduxjs/toolkit';
import { starWarsApi } from '../features/api/starWarsApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Hero } from '../features/selector/SelectorSlice';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

interface TestApiResult<T> {
  data?: T;
  error?: unknown;
}

describe('starWarsApi', () => {
  let store: ReturnType<typeof configureStore>;
  let appDispatch: ThunkDispatch<
    ReturnType<typeof store.getState>,
    unknown,
    Action
  >;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    store = configureStore({
      reducer: { [starWarsApi.reducerPath]: starWarsApi.reducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(starWarsApi.middleware),
    });

    appDispatch = store.dispatch as ThunkDispatch<
      ReturnType<typeof store.getState>,
      unknown,
      Action
    >;

    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(async () => {
    await store.dispatch(starWarsApi.util.resetApiState());
    consoleErrorMock.mockRestore();
  });

  test('fetchCharacters should return data', async () => {
    const mockData = {
      results: [
        { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      ],
      next: null,
    };

    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      starWarsApi.endpoints.fetchCharacters.initiate({ search: '', page: 1 })
    )) as TestApiResult<typeof mockData>;

    expect(result.data).toEqual(mockData);
  });

  test('fetchCharacterDetails should return hero data', async () => {
    const mockData: Hero = {
      name: 'Darth Vader',
      url: 'https://swapi.dev/api/people/4/',
    };

    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      starWarsApi.endpoints.fetchCharacterDetails.initiate('4')
    )) as TestApiResult<Hero>;

    expect(result.data).toEqual(mockData);
  });

  test('fetchCharacterDetails should handle errors', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      starWarsApi.endpoints.fetchCharacterDetails.initiate('invalid-id')
    )) as TestApiResult<Hero>;

    expect(result.error).toMatchObject<FetchBaseQueryError>({
      status: 404,
      data: expect.anything(),
    });
  });

  test('fetchCharacters should handle API errors', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'Not found' }), {
        status: 404,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      starWarsApi.endpoints.fetchCharacters.initiate({
        search: 'unknown',
        page: 1,
      })
    )) as TestApiResult<{ results: Hero[]; next: string | null }>;

    expect(result.error).toMatchObject<FetchBaseQueryError>({
      status: 404,
      data: expect.anything(),
    });
  });

  test('fetchCharacters should return empty results when API returns no data', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ results: [], next: null }), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );

    const result = (await appDispatch(
      starWarsApi.endpoints.fetchCharacters.initiate({
        search: 'nobody',
        page: 1,
      })
    )) as TestApiResult<{ results: Hero[]; next: string | null }>;

    expect(result.data).toEqual({
      results: [],
      next: null,
    });
  });
});
