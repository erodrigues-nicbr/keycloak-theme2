import { ICache } from '../caches/types/cache.type';
import { IAccessTokenResponse } from './access-token-response.type';

export type IKeycloakService = {
   getUrlToLogin: (pathRedirect: string) => string;
   getAccessToken: (
      code: string,
      state?: string
   ) => Promise<IAccessTokenResponse>;
   getConfig(key: keyof IKeycloakConfig): string;
   isValidToken: (token: string) => Promise<boolean>;
   refreshToken: (refresh: string) => Promise<IAccessTokenResponse>;
};

export type IKeycloakConfig = {
   clientId: string;
   realm: string;
   keycloakUrl: string;
   hostname: string;
   clientSecret?: string;
   persistentProvider: ICache;
   scope?: string;
};
