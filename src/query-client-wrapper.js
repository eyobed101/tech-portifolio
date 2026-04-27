import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

export const wrapRootElement = ({ element }) => (
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
);
