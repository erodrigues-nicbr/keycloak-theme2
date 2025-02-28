import FileCookieUtils from '<@nicbrasil/auth-keycloak>/utils/file-cookie.utils';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
   const cookie = FileCookieUtils.readCookieFromRequest(req);

   if (!cookie) {
      return NextResponse.json({ message: 'no cookie' }, { status: 404 });
   }
   return NextResponse.json({ message: 'ok' });
   // console.log('Login callback', req);
   // return NextResponse.redirect('/');
};

export { handler as GET, handler as POST };
