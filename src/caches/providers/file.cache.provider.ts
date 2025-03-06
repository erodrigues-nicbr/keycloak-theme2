import { ICache } from '../types/cache.type';
import { promises as fs } from 'fs';

/**
 * FileCacheProvider is a file-based cache implementation of the ICache interface.
 * It uses a JSON file to store key-value pairs.
 */
export default class FileCacheProvider implements ICache {
   /**
    * The internal cache file path.
    */
   private cacheFilePath: string;

   /**
    * Creates an instance of FileCacheProvider.
    * @param cacheFilePath - The path to the cache file.
    */
   constructor(cacheFilePath: string) {
      this.cacheFilePath = cacheFilePath;

      // Ensure the cache folder exists
      const cacheFolder = cacheFilePath.replace(/\/[^/]+$/, '');
      fs.mkdir(cacheFolder, { recursive: true });
   }

   /**
    * Retrieves a value from the cache by its key.
    * @param key - The key of the value to retrieve.
    * @returns A promise that resolves to the value associated with the key, or null if the key does not exist.
    */
   async get(key: string): Promise<string | null> {
      const cache = await this.readCacheFile();
      return cache[key] || null;
   }

   /**
    * Sets a value in the cache with the specified key.
    * @param key - The key to associate with the value.
    * @param value - The value to store in the cache.
    * @returns A promise that resolves when the value has been set.
    */
   async set(key: string, value: string): Promise<void> {
      const cache = await this.readCacheFile();
      cache[key] = value;
      await this.writeCacheFile(cache);
   }

   /**
    * Deletes a value from the cache by its key.
    * @param key - The key of the value to delete.
    * @returns A promise that resolves when the value has been deleted.
    */
   async del(key: string): Promise<void> {
      const cache = await this.readCacheFile();
      delete cache[key];
      await this.writeCacheFile(cache);
   }

   /**
    * Clears all values from the cache.
    * @returns A promise that resolves when the cache has been cleared.
    */
   async clear(): Promise<void> {
      await this.writeCacheFile({});
   }

   /**
    * Reads the cache file and returns the parsed JSON object.
    * @returns A promise that resolves to the parsed JSON object.
    */
   private async readCacheFile(): Promise<{ [key: string]: string }> {
      try {
         const data = await fs.readFile(this.cacheFilePath, 'utf-8');
         return JSON.parse(data);
      } catch (error) {
         if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return {};
         }
         throw error;
      }
   }

   /**
    * Writes the given object to the cache file as JSON.
    * @param cache - The object to write to the cache file.
    * @returns A promise that resolves when the file has been written.
    */
   private async writeCacheFile(cache: {
      [key: string]: string;
   }): Promise<void> {
      const data = JSON.stringify(cache, null, 2);
      await fs.writeFile(this.cacheFilePath, data, 'utf-8');
   }
}
