import { ICache } from '../types/cache.type';

/**
 * MemoryCacheProvider is an in-memory cache implementation of the ICache interface.
 * It uses a Map to store key-value pairs in memory.
 */
export default class MemoryCacheProvider implements ICache {
   /**
    * The internal cache storage.
    */
   private cache: Map<string, string>;

   /**
    * Creates an instance of MemoryCacheProvider.
    */
   constructor() {
      this.cache = new Map<string, string>();
   }

   /**
    * Retrieves a value from the cache by its key.
    * @param key - The key of the value to retrieve.
    * @returns A promise that resolves to the value associated with the key, or null if the key does not exist.
    */
   async get(key: string): Promise<string | null> {
      return this.cache.get(key) || null;
   }

   /**
    * Sets a value in the cache with the specified key.
    * @param key - The key to associate with the value.
    * @param value - The value to store in the cache.
    * @returns A promise that resolves when the value has been set.
    */
   async set(key: string, value: string): Promise<void> {
      this.cache.set(key, value);
   }

   /**
    * Deletes a value from the cache by its key.
    * @param key - The key of the value to delete.
    * @returns A promise that resolves when the value has been deleted.
    */
   async del(key: string): Promise<void> {
      this.cache.delete(key);
   }

   /**
    * Clears all values from the cache.
    * @returns A promise that resolves when the cache has been cleared.
    */
   async clear(): Promise<void> {
      this.cache.clear();
   }
}
