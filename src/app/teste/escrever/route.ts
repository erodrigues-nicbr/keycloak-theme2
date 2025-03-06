import Utils from '<@nicbrasil/auth-keycloak>/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
   await Utils.createSession({
      access_token: '',
      expires_in: 5000,
      refresh_token: '',
      token_type: '',
      refresh_expires_in: 5000,
      scope: '',
      session_state: '',
   });

   const url = new URL('/teste/', req.nextUrl.origin);
   return NextResponse.redirect(url.toString());
};
