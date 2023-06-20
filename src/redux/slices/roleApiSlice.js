import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const rolesAdapter = createEntityAdapter({});

const initialState = rolesAdapter.getInitialState();

export const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params = {}) => ({
        url: '/panel/roles',
        params,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage } = responseData;
        const prebuiltReducer = rolesAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) return [{ type: 'Role', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Role', id }))];
        return [{ type: 'Role', id: 'LIST' }];
      },
    }),
    addNewRole: builder.mutation({
      query: (params) => ({
        url: '/panel/role',
        method: 'POST',
        body: {
          ...params,
        },
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    updateRole: builder.mutation({
      query: (params) => ({
        url: '/panel/role',
        method: 'PATCH',
        body: {
          ...params,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Role', id: arg.id }];
      },
    }),
    deleteRole: builder.mutation({
      query: (params) => ({
        url: `/panel/roles`,
        method: 'DELETE',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Role', id: arg.id }],
    }),
  }),
});

export const { useGetRolesQuery, useAddNewRoleMutation, useDeleteRoleMutation, useUpdateRoleMutation } = roleApiSlice;

// returns the query result object
export const selectRoleResult = roleApiSlice.endpoints.getRoles.select();

// creates memoized selector
const selectRolesData = createSelector(
  selectRoleResult,
  (rolesResult) => rolesResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllRoles,
  selectById: selectRoleById,
  selectIds: selectRoleIds,
  // Pass in a selector that returns the Roles slice of state
} = rolesAdapter.getSelectors((state) => selectRolesData(state) ?? initialState);
