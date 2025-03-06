import Memcached from 'memcached';

class CacheUtilsClass {
   private cache: Memcached;
   constructor() {
      const memcachedHost = process.env.MEMCACHED_HOST || 'localhost:11211';
      this.cache = new Memcached(memcachedHost);
   }

   async getAllKeys(): Promise<string[]> {
      return new Promise((resolve, reject) => {
         this.cache.stats((err, stats) => {
            if (err) {
               console.error('🚨 Erro ao buscar stats:', err);
               return reject(err);
            }

            const keys: string[] = [];
            let pendingSlabs = 0;

            stats.forEach((serverStat) => {
               for (const key in serverStat) {
                  if (key.startsWith('items:') && key.endsWith(':number')) {
                     const slabId = key.split(':')[1];
                     pendingSlabs++;

                     this.cache.command(
                        `stats cachedump ${slabId} 100`,
                        (err, response) => {
                           pendingSlabs--;

                           if (!err && response) {
                              response.split('\n').forEach((line) => {
                                 const match = line.match(
                                    /ITEM (.+) \[(\d+) b; (\d+) s\]/
                                 );
                                 if (match) keys.push(match[1]);
                              });
                           }

                           if (pendingSlabs === 0) {
                              resolve(keys);
                           }
                        }
                     );
                  }
               }
            });

            if (pendingSlabs === 0) resolve(keys);
         });
      });
   }
}

const CacheUtils = new CacheUtilsClass();

// 🚀 Teste
CacheUtils.getAllKeys()
   .then((keys) => {
      console.log('🔑 Chaves encontradas no Memcached:', keys);
   })
   .catch(console.error);
