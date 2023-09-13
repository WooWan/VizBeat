import { useAudioTracks } from '@/hooks/queries/music/useMusics';
import { useRouter } from 'next/router';
import StageCanvas from '@/components/StageCanvas';
import MultitrackController from '@/components/MultitrackController';
import { useEffect } from 'react';
import { useMusicStore } from '@/store/music';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { fetchMusic } from '@/service/musics';
import { z } from 'zod';
import { Music } from '@prisma/client';
import Head from 'next/head';

type Props = Pick<Music, 'title' | 'albumCover'>;

export default function StagePage({ title, albumCover }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:image" content={albumCover} />
      </Head>
      <StageCanvas tracks={audios} />
      <MultitrackController audios={audios} />
    </>
  );
}

export const getServerSideProps = (async (context) => {
  const id = context.query?.slug;
  const parsedId = z.string().parse(id);
  const { title, albumCover } = await fetchMusic(parsedId);

  return {
    props: {
      title,
      albumCover
    }
  };
}) satisfies GetServerSideProps<Props>;
