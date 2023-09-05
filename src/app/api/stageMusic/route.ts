import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { url } = req;
  const id = url.split('id=')[1];
  const res = await prisma.music.findUnique({
    where: {
      id: id
    }
  });
  return NextResponse.json(res);
}
