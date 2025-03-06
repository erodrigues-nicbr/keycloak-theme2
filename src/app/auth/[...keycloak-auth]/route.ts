import { MemcachedCacheProvider } from '<@nicbrasil/auth-keycloak>/caches/providers/memcached.cache.provider';
import { KeycloakAuthService } from '<@nicbrasil/auth-keycloak>/service/keycloak-auth.service';
const handler = KeycloakAuthService.createHandlers({
   clientId: 'kumo-portal',
   realm: 'master',
   keycloakUrl: 'https://keycloak.homologacao.devsys.nic.br',
   hostname: 'http://localhost:3000',
   clientSecret: 'gbABqCVQDLaG32jM91jjiwCp81rUNnG6',
   persistentProvider: new MemcachedCacheProvider('localhost:11211'),
});

export { handler as GET, handler as POST };
