import { type Action, type ThunkAction, configureStore } from '@reduxjs/toolkit';
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  useStore as useReduxStore,
  type TypedUseSelectorHook,
} from 'react-redux';
import { reducer } from './rootReducer';

export const reduxStore = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// define redux types
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;

// re-write the hooks
export const useDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;
export const useStore: () => ReduxStore = useReduxStore;
