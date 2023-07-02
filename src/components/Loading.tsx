import React from 'react';
import Image from 'next/image';

const Loading = () => {
  return (
    <section className={'flex h-screen w-screen items-center justify-center bg-black'}>
      <Image
        src={'/images/vinyl_record.webp'}
        alt={'loading'}
        width={300}
        height={300}
        className={'animate-spin-slow'}
      />
    </section>
  );
};

export default Loading;
