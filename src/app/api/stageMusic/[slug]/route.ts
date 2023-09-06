import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest, { params }: { params: { slug: string } }) {
  const res = await prisma.music.findUnique({
    where: {
      id: params.slug
    }
  });
  return NextResponse.json(res);
}
