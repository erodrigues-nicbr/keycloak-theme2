import FileCookieUtils from '<@nicbrasil/auth-keycloak>/utils/file-cookie.utils';
import { NextRequest, NextResponse } from 'next/server';

export const handle = async (req: NextRequest) => {
   if (FileCookieUtils.readCookieFromRequest(req)) {
      return {
         status: 200,
         json: { message: 'ok' },
      };
   }

   const keycloakUrl = 'https://keycloak.homologacao.devsys.nic.br';
   const clientId = 'kumo-portal';
   const realm = 'master';
   const redirectUri = 'http://localhost:3000/auth/login/callback';
   const path = req.nextUrl.pathname;
   const loginUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&code=${path}`;
   return NextResponse.redirect(loginUrl);
};

export { handle as GET, handle as POST };
