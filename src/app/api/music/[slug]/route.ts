import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const res = await prisma.music.delete({
    where: {
      id: params.slug
    }
  });
  return NextResponse.json(res);
}
