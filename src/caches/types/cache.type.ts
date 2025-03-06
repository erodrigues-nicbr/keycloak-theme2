export type ICacheType = 'memory' | 'file' | 'redis' | 'memcached' | 'db';
export type ICacheOptions = {
   ttl?: number;
   maxAge?: number;
   [key: string]: unknown;
};

export interface ICache {
   get<T = unknown>(key: string): Promise<T>;
   set<T = unknown>(
      key: string,
      value: T,
      options?: ICacheOptions
   ): Promise<void>;
   del(key: string): Promise<void>;
}
