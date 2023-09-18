import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { useMediaQuery } from '@/hooks/queries/useMediaQuery';
import { mediaQuery } from '@/utils/mediaQuery';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { useRouter } from 'next/router';

export default function MusicsCanvas() {
  const matches = useMediaQuery(mediaQuery.LG);

  return (
    <section className="relative flex justify-center">
      <StageRedirectButton />
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
          <MusicList />
        </ScrollControls>
        <ambientLight />
      </Canvas>
    </section>
  );
}

function StageRedirectButton() {
  const { data: musics } = useMusics();
  const musicInfo = useMusicStore((state) => state.musicInfo);
  const selectedMusic = musics?.find((music) => music.id === musicInfo?.id);
  const [delayedMusicId, setDelayedMusicId] = useState('');
  const api = useMusicStore((state) => state.api);
  const router = useRouter();

  useEffect(() => {
    if (!musicInfo) return;
    const timeout = setTimeout(() => {
      setDelayedMusicId(musicInfo.id);
    }, 400);

    return () => clearTimeout(timeout);
  }, [musicInfo]);

  if (selectedMusic?.vocalUrl) {
    return (
      <div
        className={cn(
          'duration-[900ms] absolute left-1/2 top-1/2 z-50 flex h-12 w-12 translate-x-16 translate-y-12 cursor-pointer items-center justify-center rounded-full border-[1px] border-slate-500/[0.3] bg-zinc-950/[0.85] p-2 opacity-100 transition-opacity duration-900 lg:h-36 lg:w-36',
          {
            'opacity-0 duration-0': musicInfo?.id !== delayedMusicId
          }
        )}
        onClick={(e) => {
          router.push(`/stage/${musicInfo?.id}`);
          api.stopAudio();
          e.stopPropagation();
        }}
      >
        <span className="text-md text-center font-bold text-white">Go to Stage</span>
      </div>
    );
  }

  return <></>;
}
