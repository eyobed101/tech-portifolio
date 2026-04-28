import React from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (err) => {
            console.error('TanStack Query Error:', err);
        },
    }),
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 0,
        },
    },
});

export const wrapRootElement = ({ element }) => (
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
);
