import { NextRequest, NextResponse } from 'next/server';
import CookieUtils from './utils/cookie.utils';
import CacheUtils from './utils/cache.utils';
import { IAccessTokenResponse } from './types/access-token-response.type';

export async function middleware(req: NextRequest) {
   const url = req.nextUrl.clone();

   // Mapeamento de prefixos de serviço para diferentes APIs
   const routes: { [key: string]: string | undefined } = {
      '/service/applications':
         'https://kong.gw.homologacao.devsys.nic.br/api-github/v1',
      '/service/git': 'https://kong.gw.homologacao.devsys.nic.br/api-github/v1',
      '/service/harbor':
         'https://kong.gw.homologacao.devsys.nic.br/api-github/v1',
   };

   // Encontrar a API correta baseada no início do pathname
   const matchedPrefix = Object.keys(routes).find((prefix) =>
      url.pathname.startsWith(prefix)
   );

   // Se a rota não estiver mapeada, segue normalmente
   if (!matchedPrefix) {
      console.log(`❌ Rota não mapeada: ${url.pathname}`);
      return NextResponse.next();
   }

   // Define a API de destino baseada no prefixo encontrado
   const apiUrl = routes[matchedPrefix];
   if (!apiUrl) {
      console.log(
         `⚠️ Prefixo encontrado, mas API_URL não definida: ${matchedPrefix}`
      );
      return NextResponse.next();
   }

   if (req.headers.has('authorization')) {
      const identity = CookieUtils.getCookieFromReq(req);
      if (identity) {
         const cache = await CacheUtils.get<IAccessTokenResponse>(identity);
         console.log('Token de autorização no header', cache);
         if (cache)
            req.headers.set('authorization', 'Bearer ' + cache.access_token);
      }
   } else {
      console.log('Sem token de autor  no header');
   }

   // // Monta a nova URL de destino (preservando o caminho restante e os query params)
   const newUrl = `${apiUrl}${url.pathname.replace(matchedPrefix, '')}${
      url.search
   }`;

   console.log(`🔀 Redirecionando para: ${newUrl}`);
   return NextResponse.rewrite(newUrl);
}

// Aplicar o middleware apenas em rotas protegidas
export const config = {
   matcher: ['/service/:path*'],
};
