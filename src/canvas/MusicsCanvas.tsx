import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { useMediaQuery } from '@/hooks/queries/useMediaQuery';
import { mediaQuery } from '@/utils/mediaQuery';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music';
import { useMusics } from '@/hooks/queries/music/useMusics';

const MusicsCanvas = () => {
  const { data: musics } = useMusics();
  const matches = useMediaQuery(mediaQuery.LG);
  const music = useMusicStore((state) => state.musicInfo);

  return (
    <section className="relative flex justify-center">
      <Link
        href="/stage"
        className={cn(
          'absolute left-1/2 top-1/2 z-50 hidden h-12 w-12 translate-x-16 translate-y-12 rounded-full bg-zinc-950/[0.85] p-2 lg:h-36 lg:w-36',
          {
            'flex items-center justify-center gap-x-2': music
          }
        )}
      >
        <span className="text-md text-cente font-bold text-white">Go to Stage</span>
      </Link>
      <Canvas
        className="scrollbar-hide"
        camera={{
          zoom: matches ? 1 : 0.5,
          position: [10, 0, 0],
          fov: 100
        }}
      >
        <Environment files={'/background/dawn.hdr'} background blur={0.6} />
        <ScrollControls damping={0}>
          <MusicList musicList={musics} />
        </ScrollControls>
        <ambientLight />
      </Canvas>
    </section>
  );
};

export default MusicsCanvas;
