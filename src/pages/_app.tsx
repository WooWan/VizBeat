import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import TanstackQueryProvider from '@/components/providers/TanstackQueryProvider';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Vizbeat</title>
        <link rel="favicon" href="/favicon.ico" />
      </Head>
      <TanstackQueryProvider>
        <Component {...pageProps} />
        <Toaster />
        <Analytics />
      </TanstackQueryProvider>
    </>
  );
}
