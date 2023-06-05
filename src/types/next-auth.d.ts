import { AuthUser } from '@/src/types/member';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // custom user type
    user: AuthUser;
  }
}
