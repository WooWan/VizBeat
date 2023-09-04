import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

function prepareReactQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  return wrapper;
}

export default prepareReactQueryWrapper;
