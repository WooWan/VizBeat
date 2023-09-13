import { useAudioTracks } from '@/hooks/queries/music/useMusics';
import { useRouter } from 'next/router';
import StageCanvas from '@/components/StageCanvas';
import MultitrackController from '@/components/MultitrackController';
import { useEffect } from 'react';
import { useMusicStore } from '@/store/music';

export default function StagePage() {
  const router = useRouter();
  const { slug: musicId } = router.query;
  const { data: blobs } = useAudioTracks(musicId ? String(musicId) : '');
  const audios = blobs?.map((blob) => new Audio(URL.createObjectURL(blob)));

  const api = useMusicStore((state) => state.api);

  useEffect(() => {
    api.clear();
  }, []);

  if (!audios) return <></>;
  return (
    <>
      <StageCanvas tracks={audios} />
      <MultitrackController audios={audios} />
    </>
  );
}
