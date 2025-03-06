import { KeycloakAuthService } from '<@nicbrasil/auth-keycloak>/service/keycloak-auth.service';
import { NextRequest, NextResponse } from 'next/server';

export const handle = async (req: NextRequest) => {
   const path =
      req.nextUrl.searchParams.get('redirect') || req.nextUrl.pathname;
   const loginUrl = KeycloakAuthService.getUrlToLogin(path);
   return NextResponse.redirect(loginUrl);
};

export { handle as GET, handle as POST };
