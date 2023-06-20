import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import { apiSlice } from './api/api';
import authReducer from './slices/authSlice';
import ticketReducer from './slices/ticket';
// import chatReducer from './slices/chat';
// import productReducer from './slices/product';
// import calendarReducer from './slices/calendar';
// import kanbanReducer from './slices/kanban';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

// const productPersistConfig = {
//   key: 'product',
//   storage,
//   keyPrefix: 'redux-',
//   whitelist: ['sortBy', 'checkout'],
// };

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  ticket: ticketReducer,
  // user: userReducer,
  // toast: toastReducer,
  // chat: chatReducer,
  // calendar: calendarReducer,
  // kanban: kanbanReducer,
  // product: persistReducer(productPersistConfig, productReducer),
});

export { rootPersistConfig, rootReducer };
