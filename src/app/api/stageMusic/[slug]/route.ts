import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const res = await prisma.music.findUnique({
    where: {
      id: params.slug
    }
  });
  return NextResponse.json(res);
}
