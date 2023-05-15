import { NextResponse } from 'next/server';
export { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const res = await prisma.music.findMany();
  return NextResponse.json(res);
}
