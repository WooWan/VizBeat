import React, { Suspense, useEffect } from 'react';
import { useMusics } from '@/hooks/queries/music/useMusics';
import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/canvas/MusicsCanvas';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useMusicStore } from '@/store/music';
import { useRouter } from 'next/router';

const MusicsPage = () => {
  const { data: musics } = useMusics();
  const { api, musicInfo } = useMusicStore((state) => ({
    musicInfo: state.musicInfo,
    api: state.api
  }));
  const router = useRouter();

  return (
    <div className={'grid h-full lg:grid-cols-[480px_minmax(900px,_1fr)]'}>
      <MusicsNavbar musics={musics} />
      <section className={'relative flex justify-center'}>
        <div
          className={cn(
            'absolute left-1/2 top-1/2 z-50 hidden h-12 w-12 translate-x-16 translate-y-12 items-center justify-center rounded-full bg-zinc-950/[0.85] p-2 lg:h-36 lg:w-36',
            {
              'flex items-center justify-center gap-x-2': musicInfo
            }
          )}
          onClick={(e) => {
            api.clear();
            router.push(`/stage/${musicInfo?.id}`);
          }}
        >
          <span className="text-md text-cente font-bold text-white">Go to Stage</span>
        </div>
        <Suspense>
          <MusicsCanvas musics={musics} />
        </Suspense>
      </section>
    </div>
  );
};

export default MusicsPage;
