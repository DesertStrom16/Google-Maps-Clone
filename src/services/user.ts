import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import PeopleBasic from 'models/peopleBasic';
import {Platform} from 'react-native';
import People from '../models/people';

export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      Platform.OS === 'ios'
        ? 'http://localhost:3000/'
        : 'http://10.0.2.2:3000/',
  }),
  tagTypes: ['People'],
  endpoints: build => ({
    fetchUsers: build.query<PeopleBasic[], string>({
      query: query => ({
        url: `search-users?name=${query}`,
      }),
    }),
    selectUser: build.query<People, string>({
      query: query => ({
        url: `select-user?username=${query}`,
      }),
    }),
  }),
});

export const {useFetchUsersQuery, useSelectUserQuery} = userApi;
