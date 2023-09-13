import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/utils/password';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for');
  const userId = generateUserId(ipAddress ?? '0.0.0.0');
  const defaultId = generateUserId();

  const res = await prisma.music.findMany({
    orderBy: {
      createdAt: 'asc'
    },
    where: {
      OR: [
        {
          userId
        },
        {
          userId: defaultId
        }
      ]
    }
  });
  return NextResponse.json(res);
}
