import Image from 'next/image';
import { Inter } from 'next/font/google';
import {signIn, useSession} from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session, status } = useSession()
  console.log(session, status)

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <button onClick={() => signIn('google')}>구글 로그인!!</button>
    </main>
  );
}
