import { z } from 'zod';

const envVariables = z.object({
  NEXT_PUBLIC_HJSV: z.string(),
  NEXT_PUBLIC_HOTJAR_ID: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
