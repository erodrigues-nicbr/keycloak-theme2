import { KeycloakAuthService } from '<@nicbrasil/auth-keycloak>/service/keycloak-auth.service';
import CookieUtils from '<@nicbrasil/auth-keycloak>/utils/cookie.utils';
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

   // O token de acesso é retornado no corpo da resposta
   const cookieValue = await CookieUtils.createNewFile(accessToken);
   await CookieUtils.writeCookie(cookieValue);

   // Redireciona para a página inicial
   const url = new URL('/', KeycloakAuthService.getConfig('hostname'));

   return NextResponse.redirect(url);
};

export { handler as GET, handler as POST };
