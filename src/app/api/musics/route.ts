import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export async function GET() {
  const res = await prisma.music.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });
  return NextResponse.json(res);
}
