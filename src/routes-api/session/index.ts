import { KeycloakAuthService } from '<@nicbrasil/auth-keycloak>/service/keycloak-auth.service';
import { IAccessTokenResponse } from '<@nicbrasil/auth-keycloak>/types/access-token-response.type';
import CacheUtils from '<@nicbrasil/auth-keycloak>/utils/cache.utils';
import CookieUtils from '<@nicbrasil/auth-keycloak>/utils/cookie.utils';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
   const cookieValue = CookieUtils.getCookieFromReq(req);
   if (!cookieValue)
      return NextResponse.json({ message: 'no cookie' }, { status: 404 });

   const cache = CacheUtils.get<IAccessTokenResponse>(cookieValue);
   // Verifica se o token é válido
   if (!cache)
      return NextResponse.json({ message: 'no cookie' }, { status: 404 });

   const isValidToken = await KeycloakAuthService.isValidToken(
      cache.access_token
   );

   // Se não for válido, tenta renovar o token
   if (!isValidToken) {
      try {
         const newToken = await KeycloakAuthService.refreshToken(
            cache.refresh_token
         );
         if (newToken && !('error' in newToken)) {
            CacheUtils.set(cookieValue, newToken);
         }
      } catch {
         CacheUtils.delete(cookieValue);
         CookieUtils.deleteCookie();
         const url = new URL('/acesso-negado', KeycloakAuthService.getConfig('hostname'));
         return NextResponse.redirect(url.toString());
      }
   }

   return NextResponse.json({ message: 'ok' });
};

export { handler as GET, handler as POST };
