import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params = {}) => {
        return {
          url: '/panel/users',
          params,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage } = responseData;
        const prebuiltReducer = usersAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) return [{ type: 'User', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'User', id }))];
        return [{ type: 'User', id: 'LIST' }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/panel/user',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/panel/user',
        method: 'PATCH',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    updateSelfUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/user',
        method: 'PATCH',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'Auth', id: 'REFRESH' }],
    }),
    deleteUser: builder.mutation({
      query: (params) => ({
        url: `/panel/users`,
        method: 'DELETE',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    changePassword: builder.mutation({
      query: (params) => ({
        url: '/change-password',
        method: 'PATCH',
        body: params,
      }),
      invalidatesTags: [{ type: 'Auth', id: 'REFRESH' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useUpdateSelfUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
