import { COOKIE_DEFAULT_AGE, COOKIE_NAME } from '../contants';
import { IAccessTokenResponse } from '../types/access-token-response.type';
import CacheUtils from './cache.utils';
import CookieUtils from './cookie.utils';

export default class Utils {
   static generateDynamicId(): string {
      const random =
         Math.random().toString(36).substring(2) + Date.now().toString(36);
      const base64 = Buffer.from(random.repeat(4))
         .toString('base64')
         .substring(0, 125);
      return base64.replace(/=/g, '');
   }

   static async createSession(
      accessToken: IAccessTokenResponse
   ): Promise<string> {
      const sessionId = this.generateDynamicId();
      await CookieUtils.setCookie({
         name: COOKIE_NAME,
         value: sessionId,
         options: {
            maxAge: accessToken.expires_in ?? COOKIE_DEFAULT_AGE,
         },
      });

      await CacheUtils.set<IAccessTokenResponse>(
         sessionId,
         accessToken,
         accessToken.expires_in ?? COOKIE_DEFAULT_AGE
      );

      return sessionId;
   }
}
