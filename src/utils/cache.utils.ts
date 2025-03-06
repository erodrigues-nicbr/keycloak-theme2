import { CacheFactory, CacheType } from '../caches/cache.factory';
import { ICache } from '../caches/types/cache.type';

class CacheUtilsClass implements ICache {
   protected cache!: ICache;
   constructor() {
      CacheFactory.create(CacheType.MEMCACHED).then((cache: ICache) => {
         this.cache = cache;
      });
   }

   public async get<T>(key: string): Promise<T> {
      return this.cache.get(key);
   }

   public async set<T>(
      key: string,
      value: T,
      options?: { ttl: number }
   ): Promise<void> {
      return this.cache.set(key, value, options);
   }

   public async del(key: string): Promise<void> {
      return this.cache.del(key);
   }

   public setProvider(provider: ICache) {
      this.cache = provider;
   }
}

// Singleton - CacheUtils global para ser usado em toda a aplicação (mesmo em diferentes rotas')
const globalForCache = global as unknown as { cacheUtils?: CacheUtilsClass };
const CacheUtils = globalForCache.cacheUtils ?? new CacheUtilsClass();
globalForCache.cacheUtils = CacheUtils;

export default CacheUtils;
