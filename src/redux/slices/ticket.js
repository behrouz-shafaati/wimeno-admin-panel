import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isComposeOpen: false,
};

const slice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    // SWITCH COMPOSE
    switchShowCompose(state) {
      state.isComposeOpen = !state.isComposeOpen;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { switchShowCompose } = slice.actions;
