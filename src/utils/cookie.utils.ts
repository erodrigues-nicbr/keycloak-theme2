import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '../contants';

export default class CookieUtils {
   static async setCookie({
      name,
      value,
      options,
   }: {
      name: string;
      value: string;
      options?: { maxAge: number };
   }): Promise<void> {
      const cookiesStore = await cookies();
      cookiesStore.set(name, value, options);
   }

   static async deleteCookie(): Promise<void> {
      const cookiesStore = await cookies();
      cookiesStore.delete(COOKIE_NAME);
   }

   static getCookieFromReq(req: NextRequest): string | null {
      const cookie = req.cookies.get(COOKIE_NAME);
      if (!cookie) return null;

      return cookie.value;
   }

   static getIdentityByCookie(req: NextRequest): string | null {
      const cookie = req.cookies.get(COOKIE_NAME);
      if (!cookie) return null;

      return cookie.value;
   }
}
