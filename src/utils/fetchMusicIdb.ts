import { Music } from '@prisma/client';
import { IndexedDB } from './indexedDB';

const dbName = 'db';
const tableName = 'musics';

export async function fetchMusicsStage(music: Music) {
  const id = music.id;
  const idb = new IndexedDB(dbName);
  await idb.init();
  await idb.createTable(tableName);
  const keys = (await idb.getAllKey(tableName)) as string[];
  //vocal
  if (!keys.includes(id)) {
    const vocalBlob = await createBlobFromURL(music.vocalUrl);
    const drumBlob = await createBlobFromURL(music.drumUrl);
    const guitarBlob = await createBlobFromURL(music.guitarUrl);
    const bassBlob = await createBlobFromURL(music.bassUrl);
    const pianoBlob = await createBlobFromURL(music.pianoUrl);
    const allBlobs = { vocal: vocalBlob, drum: drumBlob, guitar: guitarBlob, bass: bassBlob, piano: pianoBlob };
    await idb.putValue(tableName, allBlobs, id);
  }
  const { vocal, drum, guitar, bass, piano } = await idb.getValue(tableName, id);
  const vocalAudio = new Audio(URL.createObjectURL(vocal));
  const drumAudio = new Audio(URL.createObjectURL(drum));
  const guitarAudio = new Audio(URL.createObjectURL(guitar));
  const bassAudio = new Audio(URL.createObjectURL(bass));
  const pianoAudio = new Audio(URL.createObjectURL(piano));
  return [vocalAudio, drumAudio, guitarAudio, bassAudio, pianoAudio];
}

async function createBlobFromURL(musicUrl: string | null) {
  if (!musicUrl) return;
  try {
    const response = await fetch(musicUrl);
    const musicData = await response.arrayBuffer();
    const musicBlob = new Blob([musicData]);
    return musicBlob;
  } catch (error) {
    return null;
  }
}

export async function fetchAndStoreMusic(id: string, url: string) {
  const idb = new IndexedDB(dbName);
  await idb.init();
  await idb.createTable(tableName);

  const keys = (await idb.getAllKey(tableName)) as string[];
  if (!keys.includes(id)) {
    const blob = await createBlobFromURL(url);
    await idb.putValue(tableName, blob, id);
  }

  return await idb.getValue(tableName, id);
}
