import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const requestsAdapter = createEntityAdapter({});

const initialState = requestsAdapter.getInitialState();

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRequests: builder.query({
      query: () => ({
        url: '/panel/allRequests',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const prebuiltReducer = requestsAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) return [{ type: 'Request', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Request', id }))];
        return [{ type: 'Request', id: 'LIST' }];
      },
    }),
  }),
});

export const { useGetAllRequestsQuery } = requestApiSlice;

// returns the query result object
export const selectRequestResult = requestApiSlice.endpoints.getAllRequests.select();

// creates memoized selector
const selectRequestsData = createSelector(
  selectRequestResult,
  (requestsResult) => requestsResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllRequests,
  selectById: selectRequestById,
  selectIds: selectRequestIds,
  // Pass in a selector that returns the Requests slice of state
} = requestsAdapter.getSelectors((state) => selectRequestsData(state) ?? initialState);
