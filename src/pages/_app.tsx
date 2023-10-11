import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import TanstackQueryProvider from '@/components/providers/TanstackQueryProvider';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';
import useHotjar from '@/hooks/useHotjar';

export default function App({ Component, pageProps }: AppProps) {
  useHotjar();

  return (
    <>
      <Head>
        <title>Vizbeat</title>
        <link rel="favicon" href="/favicon.ico" />
      </Head>
      <TanstackQueryProvider dehydratedState={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <Toaster />
        <Analytics />
      </TanstackQueryProvider>
    </>
  );
}
