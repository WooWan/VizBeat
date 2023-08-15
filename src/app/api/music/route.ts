import { exec } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'node:fs';
import FormData from 'form-data';
import { Readable } from 'stream';
import axios from 'axios';
import { UploadMusicUrl } from '@/types/spotify';

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

export async function POST(request: NextRequest) {
  const music = (await request.json()) as UploadMusicUrl;
  const formData = new FormData();

  const mp3path = await downloadSpotify(music.url);

  if (!mp3path) {
    return NextResponse.json({
      status: 400,
      message: 'Failed to download music'
    });
  }
  const readStream = createReadStream(mp3path);
  formData.append('audio', readStream);

  await removeFile(mp3path);

  formData.append('title', music.title);
  formData.append('artist', music.artist);
  formData.append('albumCover', music.albumCover);
  const res = await axios.post(`http://127.0.0.1:8000/music-separation`, formData, {
    headers: {
      'Content-Type': `multipart/form-data=; boundary=${formData.getBoundary()}`
    }
  });
  return NextResponse.json({ ...res.data });
}
