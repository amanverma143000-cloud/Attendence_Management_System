import { apiSlice } from '../../app/apiSlice';

export const overtimeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestOvertime: builder.mutation({
      query: (data) => ({ url: '/overtime', method: 'POST', body: data }),
      invalidatesTags: ['Overtime'],
    }),
    getMyOvertime: builder.query({
      query: () => '/overtime/my',
      providesTags: ['Overtime'],
    }),
    getAllOvertime: builder.query({
      query: () => '/overtime/all',
      providesTags: ['Overtime'],
    }),
    reviewOvertime: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/overtime/${id}/review`, method: 'PATCH', body }),
      invalidatesTags: ['Overtime'],
    }),
  }),
});

export const {
  useRequestOvertimeMutation, useGetMyOvertimeQuery,
  useGetAllOvertimeQuery, useReviewOvertimeMutation,
} = overtimeApi;
