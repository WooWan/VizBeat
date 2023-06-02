import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import TanstackQueryProvider from '@/components/providers/TanstackQueryProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <TanstackQueryProvider>
        <div className="h-screen">
          <Component {...pageProps} />
        </div>
      </TanstackQueryProvider>
    </SessionProvider>
  );
}
