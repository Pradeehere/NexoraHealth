import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const airQualityApi = createApi({
    reducerPath: 'airQualityApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/air-quality',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAirQuality: builder.query({
            query: ({ lat, lon }) => `?lat=${lat}&lon=${lon}`,
        }),
    }),
});

export const { useGetAirQualityQuery } = airQualityApi;
