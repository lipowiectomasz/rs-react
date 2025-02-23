import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Hero } from '../selector/SelectorSlice';

export const starWarsApi = createApi({
  reducerPath: 'starWarsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://swapi.dev/api' }),
  endpoints: (builder) => ({
    fetchCharacters: builder.query<
      { results: Hero[]; next: string | null },
      { search: string; page: number }
    >({
      query: ({ search, page }) => ({
        url: 'people/',
        params: search
          ? { search, page: Math.max(1, page) }
          : { page: Math.max(1, page) },
      }),
      keepUnusedDataFor: 60,
    }),
    fetchCharacterDetails: builder.query<Hero, string>({
      query: (id) => `people/${id}`,
    }),
  }),
});

export const { useFetchCharactersQuery, useFetchCharacterDetailsQuery } =
  starWarsApi;
