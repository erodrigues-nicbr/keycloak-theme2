import { COOKIE_NAME } from '<@nicbrasil/auth-keycloak>/contants';
import { KeycloakAuthService } from '<@nicbrasil/auth-keycloak>/service/keycloak-auth.service';
import { IAccessTokenResponse } from '<@nicbrasil/auth-keycloak>/types/access-token-response.type';
import CacheUtils from '<@nicbrasil/auth-keycloak>/utils/cache.utils';
import CookieUtils from '<@nicbrasil/auth-keycloak>/utils/cookie.utils';
import Utils from '<@nicbrasil/auth-keycloak>/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

const handler = async ({ req }: { req: NextRequest }) => {
   const error_description = req.nextUrl.searchParams.get('error_description');
   if (error_description) {
      return NextResponse.json({ error: error_description }, { status: 400 });
   }

   // O código é um parâmetro obrigatório que é retornado pelo Keycloak
   const code: string = req.nextUrl.searchParams.get('code') ?? '';
   if (!code)
      return NextResponse.json({ error: 'code not found' }, { status: 400 });

   // O estado é um parâmetro opcional que pode ser utilizado para proteger contra ataques CSRF
   const state = req.nextUrl.searchParams.get('state') ?? '';
   const accessToken = await KeycloakAuthService.getAccessToken(
      code,
      state
   ).catch((error) => {
      console.error('Error:', error);
      return null;
   });

   // Sem o token de acesso, não é possível prosseguir
   if (!accessToken) {
      return NextResponse.json('Não foi possível obter o token de acesso', {
         status: 400,
      });
   }

   const identity = Utils.generateDynamicId();
   // Salva o token de acesso no cookie
   await CookieUtils.setCookie({
      name: COOKIE_NAME,
      value: identity,
      options: {
         maxAge: accessToken.expires_in,
      },
   });
   await CacheUtils.set<IAccessTokenResponse>(
      identity,
      accessToken,
      accessToken.expires_in
   );

   // Redireciona para a URL original (onde recebeu o primeiro aviso de login necessário)
   const url = new URL(state ?? '/', KeycloakAuthService.getConfig('hostname'));

   return NextResponse.redirect(url);
};

export { handler as GET, handler as POST };
