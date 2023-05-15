import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Ground from '@/components/3d/Ground';
import Image from 'next/image';

const LoginPage = () => {
  const { data: session } = useSession();

  return (
    <div className={'h-screen'}>
      <Canvas gl={{ alpha: false }} dpr={[1, 1.5]}>
        <color attach={'background'} args={['black']} />
        <OrbitControls />
        <Html position={[-5, 2, 0]}>
          <nav
            style={{ boxShadow: '-3px -3px 9px #aaa9a9a2, 3px 3px 7px rgba(147, 149, 151, 0.671)' }}
            className={
              'text-white rounded-lg p-4 flex flex-col items-center w-96 h-96 shadow-[-3px -3px 9px shadow-white]'
            }
          >
            <header className={'pt-4 pb-12'}>
              <h2 className={'text-xl'}>Social Login</h2>
            </header>
            {session ? (
              <div>Signed in as hard coding</div>
            ) : (
              <ul className={'flex'}>
                <li onClick={() => signIn('google')} className={'cursor-pointer'}>
                  <Image src={'/google_login.png'} alt={'google login'} width={198} height={198} />
                </li>
              </ul>
            )}
          </nav>
        </Html>
        <Physics>
          <Ground />
        </Physics>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
};

export default LoginPage;
