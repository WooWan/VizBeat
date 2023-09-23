import { NextResponse } from 'next/server';
import { findMusicById } from '@/utils/prisma';

export const revalidate = 0;

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const res = await findMusicById(params.slug);
  return NextResponse.json(res);
}
