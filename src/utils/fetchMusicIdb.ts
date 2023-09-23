import { IndexedDB } from './indexedDB';
import { fetchMusicAudioFile } from '@/service/musics';

const dbName = 'db';
const tableName = 'musics';

export async function fetchAndStoreMusic(url?: string | null): Promise<Blob> {
  if (!url) {
    throw new Error('url is undefined');
  }

  try {
    const idb = new IndexedDB(dbName);
    await idb.init();
    await idb.createTable(tableName);

    const keys = (await idb.getAllKey(tableName)) as string[];

    if (!keys.includes(url)) {
      const arrayBuffer = await fetchMusicAudioFile(url);
      const blob = new Blob([arrayBuffer]);
      await idb.putValue(tableName, blob, url);
    }

    return await idb.getValue(tableName, url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
