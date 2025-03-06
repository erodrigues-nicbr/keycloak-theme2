import CacheUtils from '<@nicbrasil/auth-keycloak>/utils/cache.utils';
import { NextResponse } from 'next/server';

export const GET = async () => {
   return NextResponse.json(CacheUtils.getAll());
};
