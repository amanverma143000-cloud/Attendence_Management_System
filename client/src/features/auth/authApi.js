import { apiSlice } from '../../app/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
