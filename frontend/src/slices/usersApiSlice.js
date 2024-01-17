import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
        // credentials: 'include',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
  }),
});

//maybe if we dont persist the user data in localstorage, everytime the user open the web
// we have to setup useEffect and also create useGetProfileQuery to fetch the user data
//and save the data using setCredentials.

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  usersApiSlice;
