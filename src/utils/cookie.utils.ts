import { NextRequest } from 'next/server';
import { IAccessTokenResponse } from '../types/access-token-response.type';
import { ICookieValue } from '../types/cookie-type';
import { cookies } from 'next/headers';
import fs from 'fs';

export default class CookieUtils {
   static readonly COOKIE_NAME = 'kca2-identity';
   static readonly COOKIE_PATH_FILE = '/tmp/next-session';
   static readonly COOKIE_EXTENSION = 'session';

   static readCookie(identityId: string): IAccessTokenResponse | null {
      try {
         const cookieData = fs.readFileSync(
            CookieUtils.getCookieFilePath(identityId),
            'utf8'
         );
         return JSON.parse(cookieData);
      } catch {
         return null;
      }
   }

   static async writeCookie(value: string): Promise<void> {
      const contentFile = CookieUtils.readCookie(value);
      if (!contentFile) return;

      const cookiesStore = await cookies();

      await cookiesStore.set(CookieUtils.COOKIE_NAME, value, {
         name: CookieUtils.COOKIE_NAME,
         value,
         maxAge: contentFile.expires_in,
         secure: true,
         httpOnly: true,
      });
   }

   static deleteCookie(identityId: string): void {
      fs.unlinkSync(CookieUtils.getCookieFilePath(identityId));
   }

   static cookieExists(identityId: string): boolean {
      return fs.existsSync(CookieUtils.getCookieFilePath(identityId));
   }

   static readFileFromRequest(req: NextRequest): ICookieValue | null {
      const cookie = req.cookies.get(CookieUtils.COOKIE_NAME);
      if (!cookie) return null;

      return CookieUtils.cookieExists(cookie.value)
         ? CookieUtils.readCookie(cookie.value)
         : null;
   }

   static async createNewFile(content: IAccessTokenResponse): Promise<string> {
      CookieUtils.ensureFolderExists();
      const identityId = CookieUtils.generateDynamicId();
      CookieUtils.writeOnFile(identityId, JSON.stringify(content));
      return identityId;
   }

   private static getCookieFilePath(identityId: string): string {
      return `${CookieUtils.COOKIE_PATH_FILE}/${identityId}.${CookieUtils.COOKIE_EXTENSION}`;
   }

   private static ensureFolderExists(): void {
      if (!fs.existsSync(CookieUtils.COOKIE_PATH_FILE)) {
         fs.mkdirSync(CookieUtils.COOKIE_PATH_FILE);
      }
   }

   private static generateDynamicId(): string {
      const random =
         Math.random().toString(36).substring(2) + Date.now().toString(36);
      return Buffer.from(random.repeat(4)).toString('base64').substring(0, 125);
   }

   static writeOnFile(name: string, content: string): void {
      CookieUtils.ensureFolderExists();
      fs.writeFileSync(CookieUtils.getCookieFilePath(name), content);
   }

   static getIdentityByCookie(req: NextRequest): string | null {
      const cookie = req.cookies.get(CookieUtils.COOKIE_NAME);
      if (!cookie) return null;

      return cookie.value;
   }
}
