import { useAudioTracks } from '@/hooks/queries/music/useMusics';
import StageCanvas from '@/components/canvas/StageCanvas';
import MultitrackController from '@/components/MultitrackController';
import { useEffect } from 'react';
import { useMusicStore } from '@/store/music';
import type { GetStaticProps, InferGetServerSidePropsType } from 'next';
import { z } from 'zod';
import Head from 'next/head';
import { prisma } from '@/lib/prisma';
import { findMusicById } from '@/utils/prisma';

export default function StagePage({ id, title, albumCover }: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { data: blobs } = useAudioTracks(id ?? '');
  const audios = blobs?.map((blob) => new Audio(URL.createObjectURL(blob)));
  const api = useMusicStore((state) => state.api);

  useEffect(() => {
    api.clear();
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:image" content={albumCover} />
      </Head>
      <StageCanvas audios={audios} />
      <MultitrackController audios={audios} />
    </>
  );
}

export async function getStaticPaths() {
  const musics = await prisma.music.findMany();
  const paths = musics.map((music) => ({
    params: { slug: music.id }
  }));

  return { paths, fallback: 'blocking' };
}

export const getStaticProps = (async ({ params }) => {
  const id = z.string().parse(params?.slug);
  const music = await findMusicById(id);

  return {
    props: {
      title: music?.title,
      albumCover: music?.albumCover,
      id: music?.id
    }
  };
}) satisfies GetStaticProps;
