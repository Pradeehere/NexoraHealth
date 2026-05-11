import { configureStore } from '@reduxjs/toolkit';
// Add reducers when auth and health slices are created
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import { airQualityApi } from '../features/airQuality/airQualityApi';

const rootReducer = combineReducers({
    auth: authReducer,
    [airQualityApi.reducerPath]: airQualityApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(airQualityApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});
