import fs from 'fs';
import { NextRequest } from 'next/server';

type CookieValue = {
   jwt: string;
   refreshToken: string;
   sessionState: string;
   expires: number;
};

export default class FileCookieUtils {
   protected static cookieName = 'kca2-identity';
   protected static cookiePath = '/';
   protected static cookiePathFile = '/tmp/next-session';

   static readCookie(identityId: string) {
      const cookie = fs.readFileSync(
         `${FileCookieUtils.cookiePathFile}/${identityId}.session`,
         'utf8'
      );
      if (!cookie) {
         return null;
      }

      return JSON.parse(cookie);
   }

   static writeCookie(identityId: string, cookie: CookieValue) {
      fs.writeFileSync(
         `${FileCookieUtils.cookiePathFile}/${identityId}.session`,
         JSON.stringify(cookie)
      );
   }

   static deleteCookie(identityId: string) {
      fs.unlinkSync(`${FileCookieUtils.cookiePathFile}/${identityId}.session`);
   }

   static cookieExists(identityId: string) {
      return fs.existsSync(
         `${FileCookieUtils.cookiePathFile}/${identityId}.session`
      );
   }

   static readCookieFromRequest(req: NextRequest) {
      const cookie = req.cookies.get(FileCookieUtils.cookieName);
      if (!cookie) {
         return null;
      }

      if (FileCookieUtils.cookieExists(cookie.value)) {
         return FileCookieUtils.readCookie(cookie.value);
      }

      return null;
   }

   static createFolder() {
      if (!fs.existsSync(FileCookieUtils.cookiePathFile)) {
         fs.mkdirSync(FileCookieUtils.cookiePathFile);
      }
   }

   static generateDynamicId() {
      const random = Math.random().toString(36).substring(7);
      return Buffer.from(random).toString('base64');
   }

   static createANewFIle(
      req: NextRequest,
      body: any
   ): {
      name: string;
      value: CookieValue;
   } {
      FileCookieUtils.createFolder();
      const identityId = FileCookieUtils.generateDynamicId();
      const cookie = {
         jwt: body.jwt,
         refreshToken: body.refreshToken,
         sessionState: body.sessionState,
         expires: body.expires,
      };
      FileCookieUtils.writeCookie(identityId, cookie);
      req.cookies.set(FileCookieUtils.cookieName, identityId);
      return { name: identityId, value: cookie };
   }
}
