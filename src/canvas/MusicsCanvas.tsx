import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { useMediaQuery } from '@/hooks/queries/useMediaQuery';
import { mediaQuery } from '@/utils/mediaQuery';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { Music } from '@prisma/client';

export default function MusicsCanvas() {
  const { data: musics } = useMusics();
  const matches = useMediaQuery(mediaQuery.LG);
  const music = useMusicStore((state) => state.musicInfo);

  return (
    <section className="relative flex justify-center">
      {music && <StageRedirectButton music={music} />}
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
}

function StageRedirectButton({ music }: { music: Music }) {
  const [musicInfo, setMusicInfo] = useState<string[]>([]);
  const len = musicInfo.length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMusicInfo((prev) => [...prev, music?.id]);
    }, 400);
    return () => {
      clearTimeout(timeout);
    };
  }, [music]);

  return (
    <Link
      href="/stage"
      className={cn(
        'duration-900 absolute left-1/2 top-1/2 z-50 flex h-12 w-12 translate-x-16 translate-y-12 items-center justify-center rounded-full bg-zinc-950/[0.85] p-2 opacity-100 transition-opacity duration-900 lg:h-36 lg:w-36',
        {
          'opacity-0 duration-0': music.id !== musicInfo[len - 1]
        }
      )}
    >
      <span className="text-md text-cente font-bold text-white">Go to Stage</span>
    </Link>
  );
}
