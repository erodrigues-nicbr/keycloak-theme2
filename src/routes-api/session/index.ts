import { KeycloakAuthService } from '<@nicbrasil/auth-keycloak>/service/keycloak-auth.service';
import CookieUtils from '<@nicbrasil/auth-keycloak>/utils/cookie.utils';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
   const identity = CookieUtils.getIdentityByCookie(req);
   if (!identity)
      return NextResponse.json({ message: 'no cookie' }, { status: 404 });

   const cookieValue = CookieUtils.readCookie(identity);
   if (!cookieValue)
      return NextResponse.json({ message: 'no cookie' }, { status: 404 });

   // Verifica se o token é válido
   const isValidToken = await KeycloakAuthService.isValidToken(
      cookieValue.access_token
   );

   // Se não for válido, tenta renovar o token
   if (!isValidToken) {
      try {
         const newToken = await KeycloakAuthService.refreshToken(
            cookieValue.refresh_token
         );
         CookieUtils.writeOnFile(identity, JSON.stringify(newToken));
      } catch {
         CookieUtils.deleteCookie(identity);
         const url = new URL('/', KeycloakAuthService.getConfig('hostname'));
         return NextResponse.redirect(url.toString());
      }
   }

   return NextResponse.json({ message: 'ok' });
};

export { handler as GET, handler as POST };
