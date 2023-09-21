import { Music } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { MusicUpload } from '@/types/music';

export function generateMockMusic(props: Partial<Music> = {}) {
  return {
    id: faker.string.uuid(),
    title: faker.music.songName(),
    artist: faker.person.firstName(),
    albumCover: faker.image.url(),
    musicUrl: faker.internet.url(),
    bassUrl: faker.internet.url(),
    guitarUrl: faker.internet.url(),
    drumUrl: faker.internet.url(),
    pianoUrl: faker.internet.url(),
    vocalUrl: faker.internet.url(),
    otherUrl: faker.internet.url(),
    userId: faker.string.uuid(),
    createdAt: faker.date.past(),
    ...props
  };
}

export function generateMockTrack(): MusicUpload {
  return {
    albumCover: faker.image.url(),
    artist: faker.person.firstName(),
    audioFile: new Blob(),
    id: faker.string.uuid(),
    title: faker.music.songName()
  };
}
