import { NextResponse } from 'next/server';

export function middleware() {
   return NextResponse.next();
}

// Aplicar o middleware apenas em rotas protegidas
export const config = {
   matcher: ['/auth/:path*'],
};
