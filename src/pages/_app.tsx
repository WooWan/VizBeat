import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import TanstackQueryProvider from '@/components/providers/TanstackQueryProvider';
import { Toaster } from '@/components/ui/toaster';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TanstackQueryProvider>
      <div className="h-screen">
        <Component {...pageProps} />
        <Toaster />
      </div>
    </TanstackQueryProvider>
  );
}
