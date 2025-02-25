import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Hero, setLoading } from '../selector/SelectorSlice';

export type FetchCharactersResponse = {
  results: Hero[];
  next: string | null;
};

export const starWarsApi = createApi({
  reducerPath: 'starWarsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://swapi.dev/api' }),
  endpoints: (builder) => ({
    fetchCharacters: builder.query<
      FetchCharactersResponse,
      { search: string; page: number }
    >({
      query: ({ search, page }) => ({
        url: 'people/',
        params: search
          ? { search, page: Math.max(1, page) }
          : { page: Math.max(1, page) },
      }),
      keepUnusedDataFor: 60,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('API error:', error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    fetchCharacterDetails: builder.query<Hero, string>({
      query: (id) => `people/${id}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('API error:', error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
  }),
});

export const { useFetchCharactersQuery, useFetchCharacterDetailsQuery } =
  starWarsApi;
