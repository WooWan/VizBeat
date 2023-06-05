import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const res = await prisma.music.findMany();
  return NextResponse.json(res);
}

const moises_url = 'https://developer-api.moises.ai/api';

export async function POST() {
  // const res = await axios.post(moises_url, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: process.env.MOISES_API_KEY
  //   },
  //   data: {
  //     name: 'woowan',
  //     workflow: 'moises/stems-vocals-drums-bass-guitar-other',
  //     params: {
  //       inputUrl:
  //         'https://sgfbjtwrqhjzbyuhnknq.supabase.co/storage/v1/object/public/music/music/night_dancer?t=2023-05-29T06%3A36%3A52.366Z'
  //     }
  //   }
  // });
  return new Response(
    JSON.stringify({
      '...res.data': 'sdfs'
    }),
    {
      headers: {
        'Content-Disposition': 'attachment; filename=file.mp3'
      }
    }
  );
}
