import { useMusic } from '@/hooks/queries/music/useMusics';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IndexedDB } from '@/utils/indexedDB';
import { Music } from '@prisma/client';
import StageCanvas from '@/components/StageCanvas';
import MultitrackController from '@/components/MultitrackController';
import { table } from 'console';

const dbName = 'db';
const tableName = 'musics';

export default function index() {
  const [tracks, setTracks] = useState<HTMLAudioElement[]>([]);
  const router = useRouter();
  const { slug: musicId } = router.query;
  const { data: music } = useMusic(musicId as string);
  const idb = new IndexedDB(dbName);

  useEffect(() => {
    if (music) {
      console.log(music);
      fetchMusicsStage(music);
    }
  }, [music]);

  async function fetchMusicsStage(music: Music) {
    await idb.init();
    await idb.createTable(tableName);
    const keys = (await idb.getAllKey(tableName)) as string[];
    //vocal
    if (!keys.includes(musicId as string)) {
      const vocalBlob = await createBlobFromURL(music.vocalUrl);
      const drumBlob = await createBlobFromURL(music.drumUrl);
      const guitarBlob = await createBlobFromURL(music.guitarUrl);
      const bassBlob = await createBlobFromURL(music.bassUrl);
      const pianoBlob = await createBlobFromURL(music.pianoUrl);
      const allBlobs = { vocal: vocalBlob, drum: drumBlob, guitar: guitarBlob, bass: bassBlob, piano: pianoBlob };
      idb.putValue(tableName, allBlobs, musicId as string);
    }
    const { vocal, drum, guitar, bass, piano } = await idb.getValue(tableName, musicId as string);
    const vocalAudio = new Audio(URL.createObjectURL(vocal));
    const drumAudio = new Audio(URL.createObjectURL(drum));
    const guitarAudio = new Audio(URL.createObjectURL(guitar));
    const bassAudio = new Audio(URL.createObjectURL(bass));
    const pianoAudio = new Audio(URL.createObjectURL(piano));
    setTracks([vocalAudio, drumAudio, guitarAudio, bassAudio, pianoAudio]);
  }

  async function createBlobFromURL(musicUrl: string) {
    try {
      const response = await fetch(musicUrl);
      const musicData = await response.arrayBuffer();
      const musicBlob = new Blob([musicData]);
      return musicBlob;
    } catch (error) {
      console.error('Error fetching audio:', error);
      return null;
    }
  }

  return (
    <>
      {tracks.length && <StageCanvas tracks={tracks} />}
      {tracks.length && <MultitrackController tracks={tracks} />}
    </>
  );
}
