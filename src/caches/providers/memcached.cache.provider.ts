import { ICache } from '../types/cache.type';
import Memcached from 'memcached';

/**
 * MemcachedCacheProvider is a Memcached-based cache implementation of the ICache interface.
 * It uses a Memcached server to store key-value pairs.
 */
export class MemcachedCacheProvider implements ICache {
   /**
    * The internal Memcached client.
    */
   private memcached: Memcached;

   /**
    * Creates an instance of MemcachedCacheProvider.
    * @param server - The address of the Memcached server.
    */
   constructor(server: string) {
      this.memcached = new Memcached(server);
   }

   /**
    * Retrieves a value from the cache by its key.
    * @param key - The key of the value to retrieve.
    * @returns A promise that resolves to the value associated with the key, or null if the key does not exist.
    */
   async get(key: string): Promise<string | null> {
      return new Promise((resolve, reject) => {
         this.memcached.get(key, (err, data) => {
            if (err) {
               return reject(err);
            }
            resolve(data || null);
         });
      });
   }

   /**
    * Sets a value in the cache with the specified key.
    * @param key - The key to associate with the value.
    * @param value - The value to store in the cache.
    * @returns A promise that resolves when the value has been set.
    */
   async set(key: string, value: string): Promise<void> {
      return new Promise((resolve, reject) => {
         this.memcached.set(key, value, 0, (err) => {
            if (err) {
               return reject(err);
            }
            resolve();
         });
      });
   }

   /**
    * Deletes a value from the cache by its key.
    * @param key - The key of the value to delete.
    * @returns A promise that resolves when the value has been deleted.
    */
   async del(key: string): Promise<void> {
      return new Promise((resolve, reject) => {
         this.memcached.del(key, (err) => {
            if (err) {
               return reject(err);
            }
            resolve();
         });
      });
   }

   /**
    * Clears all values from the cache.
    * @returns A promise that resolves when the cache has been cleared.
    */
   async clear(): Promise<void> {
      return new Promise((resolve, reject) => {
         this.memcached.flush((err) => {
            if (err) {
               return reject(err);
            }
            resolve();
         });
      });
   }
}
