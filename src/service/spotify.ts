import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

const audioPath = './audio';

async function findMP3(directory: string): Promise<string | null> {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isFile() && entry.name.endsWith('.mp3')) {
      return entryPath;
    }

    if (entry.isDirectory()) {
      const found = findMP3(entryPath);
      if (found) return found;
    }
  }

  return null;
}

export async function downloadSpotify(url: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    exec(`spotifydl --o ${audioPath} ${url}`, async (err) => {
      if (err) {
        reject(err);
      }
      const audioDir = path.join(process.cwd(), 'audio');

      const mp3Path = await findMP3(audioDir);
      resolve(mp3Path);
    });
  });
}

export async function removeFile(path: string) {
  await fs.rm(audioPath, { recursive: true, force: true });
}
