import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

const fs = require('fs');

export const addMusic = async (music: any) => {
  const res = await prisma.music.create({
    data: {
      title: music.title,
      artist: music.artist,
      albumCover: music.album,
      musicLink: '',
      user: {
        connect: {
          id: music.userId
        }
      }
    }
  });
  return res;
};

export async function POST(request: Request) {
  // return withSessionUser(async (user) => {
  //   return addMusic('dd').then((data) => NextResponse.json(data));
  // });

  const res = await request.json();
  const imgUInt = res.common.picture[0].data;
  const buffer = Buffer.from(imgUInt.data);
  const { data } = await supabase.storage.from('music').upload('dbuffer3.jpeg', buffer, {
    contentType: 'image/jpeg'
  });
  // const img = await fs.writeFile('test.jpeg', imgUInt.data, 'binary',
  console.log(data);
  // console.log(res.common.picture[0]);
  // // const imgFile = new File([imgUInt.data], 'test.jpg', { type: 'image/jpeg' });
  // console.log(imgUInt);
  // const imgFile2 = await convertBlobToImage(imgUInt.data);
  // console.log(imgFile2);
  // console.log(imgFile);
  // const imgBlob = uInt8ArrayToBlob(imgUInt, 'image/jpeg');
  // console.log('res', audioArray);
  // console.log(typeof audioArray);
  // const file = await sharp(audioArray, {
  //   raw: {
  //     width: 2,
  //     height: 1,
  //     channels: 3
  //   }
  // }).toFile('output.png');
  // console.log('file', file);
  // await prisma.music.create({
  //   data: {
  //     title: res.title,
  //     artist: res.artist,
  //     albumCover: res.album,
  //     musicLink: '',
  //     user: {
  //       connect: {
  //         id: res.userId
  //       }
  //     }
  //   }
  // });
  return NextResponse.json('hello');

  // const res = await prisma.music.findMany();
  // return NextResponse.json(res);
}
