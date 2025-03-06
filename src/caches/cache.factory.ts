import { MemcachedCacheProvider } from './providers/memcached.cache.provider';
import { ICache } from './types/cache.type';

export enum CacheType {
   MEMORY = 'memory',
   FILE = 'file',
   REDIS = 'redis',
   MEMCACHED = 'memcached',
   DB = 'db',
}
type CacheProviderFactory = {
   new (params?: unknown): ICache;
};
export class CacheFactory {
   private static providers = new Map<CacheType, CacheProviderFactory>([
      [CacheType.MEMCACHED, MemcachedCacheProvider as CacheProviderFactory],
   ]);

   static async create(
      providerType?: CacheType,
      params?: unknown
   ): Promise<ICache> {
      const type =
         providerType ||
         (process.env.CACHE_PROVIDER as CacheType) ||
         CacheType.MEMCACHED;

      const classe = this.providers.get(type);
      if (!classe) {
         throw new Error(`🚨 Cache Provider '${type}' não suportado.`);
      }

      return new classe(params);
   }
}
