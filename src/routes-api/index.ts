import { NextRequest } from 'next/server';

import { GET as loginCallback } from './login/callback/index';
import { GET as session } from './session';
import { GET as login } from './login';

const keycloakAuthApiRoutes = async (req: NextRequest) => {
   const { pathname } = req.nextUrl;

   if (pathname === '/auth/login/callback') {
      return loginCallback({ req });
   }

   if (pathname === '/auth/session') {
      return session(req);
   }

   if (pathname === '/auth/login') {
      return login(req);
   }

   // if( pathname === '/auth/session/update'){
   //   return sessionUpdate(req, res);
   // }

   // if( pathname === '/auth/session/logout'){
   //   return sessionLogout(req, res);
   // }
};

export default keycloakAuthApiRoutes;
