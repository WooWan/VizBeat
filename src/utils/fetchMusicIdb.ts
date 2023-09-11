import { IndexedDB } from './indexedDB';

const dbName = 'db';
const tableName = 'musics';

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
      const blob = await createBlobFromURL(url);
      await idb.putValue(tableName, blob, url);
    }

    return await idb.getValue(tableName, url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
