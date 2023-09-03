import { Music } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
    userId: faker.string.uuid(),
    ...props
  };
}
