import { z } from 'zod';

const envVariables = z.object({
  HJSV: z.number(),
  HOTJAR_ID: z.number()
});

export const envSchema = envVariables.parse(process.env);
