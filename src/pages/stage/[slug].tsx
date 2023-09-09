import { useMusic } from '@/hooks/queries/music/useMusics';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import StageCanvas from '@/components/StageCanvas';
import MultitrackController from '@/components/MultitrackController';
import { fetchMusicsStage } from '@/utils/fetchMusicIdb';

export default function Index() {
  const [tracks, setTracks] = useState<HTMLAudioElement[]>([]);
  const router = useRouter();
  const { slug: musicId } = router.query;
  const { data: music } = useMusic(musicId as string);

  useEffect(() => {
    if (music) {
      console.log(music);
      fetchMusicsStage(music).then((tracksArr) => setTracks(tracksArr));
    }
  }, [music]);

  return (
    <>
      {tracks.length && <StageCanvas tracks={tracks} />}
      {tracks.length && <MultitrackController tracks={tracks} />}
    </>
  );
}
