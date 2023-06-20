import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const ticketMessagesAdapter = createEntityAdapter({});

const initialState = ticketMessagesAdapter.getInitialState();

export const ticketMessageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTicketMessages: builder.query({
      query: (params = {}) => ({
        url: '/panel/ticketMessages',
        params,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage, ticket } = responseData;
        const prebuiltReducer = ticketMessagesAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, ticket, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids)
          return [{ type: 'TicketMessage', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'TicketMessage', id }))];
        return [{ type: 'TicketMessage', id: 'LIST' }];
      },
    }),
    addNewTicketMessage: builder.mutation({
      query: (params) => ({
        url: '/panel/ticketMessage',
        method: 'POST',
        body: {
          ...params,
        },
      }),
      invalidatesTags: [{ type: 'TicketMessage', id: 'LIST' }],
    }),
  }),
});

export const { useGetTicketMessagesQuery, useAddNewTicketMessageMutation } = ticketMessageApiSlice;

// returns the query result object
export const selectTicketMessageResult = ticketMessageApiSlice.endpoints.getTicketMessages.select();

// creates memoized selector
const selectTicketMessagesData = createSelector(
  selectTicketMessageResult,
  (ticketMessagesResult) => ticketMessagesResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllTicketMessages,
  selectById: selectTicketMessageById,
  selectIds: selectTicketMessageIds,
  // Pass in a selector that returns the TicketMessages slice of state
} = ticketMessagesAdapter.getSelectors((state) => selectTicketMessagesData(state) ?? initialState);
