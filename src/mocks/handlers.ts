// src/mocks/handlers.js
import { generateMockMusic } from '@/__test__/mock';
import { generateUserId } from '@/utils/password';
import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:3000/api/musics', (req, res, ctx) => {
    const musics = [
      generateMockMusic({
        userId: generateUserId(),
        albumCover: 'http://mock-album-cover.com'
      }),
      generateMockMusic()
    ];

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(musics)
    );
  }),
  rest.delete('http://localhost:3000/api/music/:slug', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
];
