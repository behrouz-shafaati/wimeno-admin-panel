import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const ticketsAdapter = createEntityAdapter({});

const initialState = ticketsAdapter.getInitialState();

export const ticketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: (params = {}) => ({
        url: '/panel/tickets',
        params,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage } = responseData;
        const prebuiltReducer = ticketsAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) return [{ type: 'Ticket', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Ticket', id }))];
        return [{ type: 'Ticket', id: 'LIST' }];
      },
    }),
    addNewTicket: builder.mutation({
      query: (params) => ({
        url: '/panel/ticket',
        method: 'POST',
        body: {
          ...params,
        },
      }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),
    updateTicket: builder.mutation({
      query: (params) => ({
        url: '/panel/ticket',
        method: 'PATCH',
        body: {
          ...params,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        return [
          { type: 'Ticket', id: arg.id },
          { type: 'TicketMessage', id: arg.id },
        ];
      },
    }),
    deleteTicket: builder.mutation({
      query: (params) => ({
        url: `/panel/tickets`,
        method: 'DELETE',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Ticket', id: arg.id }],
    }),
  }),
});

export const { useGetTicketsQuery, useAddNewTicketMutation, useDeleteTicketMutation, useUpdateTicketMutation } =
  ticketApiSlice;

// returns the query result object
export const selectTicketResult = ticketApiSlice.endpoints.getTickets.select();

// creates memoized selector
const selectTicketsData = createSelector(
  selectTicketResult,
  (ticketsResult) => ticketsResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllTickets,
  selectById: selectTicketById,
  selectIds: selectTicketIds,
  // Pass in a selector that returns the Tickets slice of state
} = ticketsAdapter.getSelectors((state) => selectTicketsData(state) ?? initialState);
