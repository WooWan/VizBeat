import MultitrackPlayer from '@/components/MultitrackPlayer';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { useMusicStore } from '@/store/music';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function index() {
  const router = useRouter();
  const musicId = router.query.slug;
  const { data } = useMusics();

  return (
    <MultitrackPlayer
      vocalUrl={data?.[2].vocalUrl}
      drumUrl={data?.[2].drumUrl}
      guitarUrl={data?.[2].guitarUrl}
      bassUrl={data?.[2].bassUrl}
      pianoUrl={data?.[2].pianoUrl}
    />
  );
}
