import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const categorysAdapter = createEntityAdapter({});

const initialState = categorysAdapter.getInitialState();

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategorys: builder.query({
      query: (params = {}) => ({
        url: '/categorys',
        params,
      }),
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage } = responseData;
        const prebuiltReducer = categorysAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids)
          return [{ type: 'Category', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Category', id }))];
        return [{ type: 'Category', id: 'LIST' }];
      },
    }),
    addNewCategory: builder.mutation({
      query: (params) => ({
        url: '/panel/category',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation({
      query: (params) => ({
        url: '/panel/category',
        method: 'PATCH',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Category', id: arg.id }];
      },
    }),
    deleteCategory: builder.mutation({
      query: (params) => ({
        url: `/panel/categorys`,
        method: 'DELETE',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }],
    }),
  }),
});

export const { useGetCategorysQuery, useAddNewCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } =
  categoryApiSlice;

// returns the query result object
export const selectCategoryResult = categoryApiSlice.endpoints.getCategorys.select();

// creates memoized selector
const selectCategorysData = createSelector(
  selectCategoryResult,
  (categorysResult) => categorysResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCategorys,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
  // Pass in a selector that returns the Categorys slice of state
} = categorysAdapter.getSelectors((state) => selectCategorysData(state) ?? initialState);
