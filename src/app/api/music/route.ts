import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'node:fs';
import FormData from 'form-data';
import axios from 'axios';
import { UploadMusicUrl } from '@/types/spotify';
import { downloadSpotify, removeFile } from '@/service/spotify';

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
