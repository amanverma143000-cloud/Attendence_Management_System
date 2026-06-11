import { apiSlice } from '../../app/apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    punchIn: builder.mutation({
      query: (data) => ({ url: '/attendance/punch-in', method: 'POST', body: data }),
      invalidatesTags: ['Attendance'],
    }),
    punchOut: builder.mutation({
      query: (data) => ({ url: '/attendance/punch-out', method: 'POST', body: data }),
      invalidatesTags: ['Attendance'],
    }),
    getTodayAttendance: builder.query({
      query: () => '/attendance/today',
      providesTags: ['Attendance'],
    }),
    getMyAttendance: builder.query({
      query: () => '/attendance/my',
      providesTags: ['Attendance'],
    }),
    getAllAttendance: builder.query({
      query: () => '/attendance/all',
      providesTags: ['Attendance'],
    }),
    getAttendanceById: builder.query({
      query: (id) => `/attendance/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Attendance', id }],
    }),
    validateAttendance: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/attendance/${id}/validate`, method: 'PATCH', body }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  usePunchInMutation, usePunchOutMutation,
  useGetTodayAttendanceQuery, useGetMyAttendanceQuery,
  useGetAllAttendanceQuery, useGetAttendanceByIdQuery,
  useValidateAttendanceMutation,
} = attendanceApi;
