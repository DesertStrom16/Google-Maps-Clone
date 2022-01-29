import {configureStore} from '@reduxjs/toolkit';
import {userApi} from '../services/user';
import userSlice from '../store/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: getDefaultMiddleware => {
    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;

      return getDefaultMiddleware().concat(
        userApi.middleware,
        createDebugger(),
      );
    } else {
      return getDefaultMiddleware().concat(userApi.middleware);
    }
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
