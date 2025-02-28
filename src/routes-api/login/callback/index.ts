import FileCookieUtils from '<@nicbrasil/auth-keycloak>/utils/file-cookie.utils';
import { NextRequest, NextResponse } from 'next/server';

const handler = async ({ req }: { req: NextRequest }) => {
   const params = req.nextUrl.searchParams;
   console.log('session_state', params.get('session_state'));
   // const cookie = FileCookieUtils.createANewFIle(req, req.body);
   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
};

export { handler as GET, handler as POST };
