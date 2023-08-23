import { z } from 'zod';

export const musicUploadSchema = z.object({
  title: z.string().min(1).max(50),
  artist: z.string().min(1).max(50)
});
