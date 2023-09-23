import { prisma } from '@/lib/prisma';

export async function findMusicById(id: string) {
  const res = await prisma.music.findUnique({
    where: {
      id
    }
  });
  return res;
}
