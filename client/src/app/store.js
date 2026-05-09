import { configureStore } from '@reduxjs/toolkit';
// Add reducers when auth and health slices are created
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});
