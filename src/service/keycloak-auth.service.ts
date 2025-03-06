import keycloakAuthApiRoutes from '../routes-api';
import { IAccessTokenResponse } from '../types/access-token-response.type';
import {
   IKeycloakConfig,
   IKeycloakService,
} from '../types/keycloak-service.type';
import CacheUtils from '../utils/cache.utils';

const endPoints: {
   [key: string]: string;
} = {
   login: '/realms/{realm}/protocol/openid-connect/auth',
   token: '/realms/{realm}/protocol/openid-connect/token',
   refresh: '/realms/{realm}/protocol/openid-connect/token',
   introspect: '/realms/{realm}/protocol/openid-connect/token/introspect',
   certs: '/realms/{realm}/protocol/openid-connect/certs',
   userinfo: '/realms/{realm}/protocol/openid-connect/userinfo',
   logout: '/realms/{realm}/protocol/openid-connect/logout',
};

class _KeycloakService implements IKeycloakService {
   protected config: IKeycloakConfig;
   protected endPoints = endPoints;

   constructor(config: IKeycloakConfig) {
      config.hostname = config.hostname.replace(/\/$/, '');
      config.scope = config.scope ?? 'openid email profile';
      this.config = config;
   }

   getUrlToLogin(pathRedirect: string) {
      const { keycloakUrl, realm, clientId } = this.config;
      const path = encodeURIComponent(pathRedirect);
      const redirectUri = this.getRedirectUri();

      return `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${path}`;
   }

   async getAccessToken(
      code: string,
      state?: string
   ): Promise<IAccessTokenResponse> {
      const url = this.getEndpoint('token');
      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('client_id', this.config.clientId);
      body.append('code', code);
      body.append(
         'redirect_uri',
         `${this.config.hostname}/auth/login/callback`
      );

      // Optional
      if (state) {
         body.append('state', state);
      }

      // Optional
      if (this.config.clientSecret) {
         body.append('client_secret', this.config.clientSecret);
      }

      return await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: body.toString(),
      }).then((res) => res.json());
   }

   protected getEndpoint(endpoint: string) {
      return `${this.config.keycloakUrl}${endPoints[endpoint].replace(
         '{realm}',
         this.config.realm
      )}`;
   }

   protected getRedirectUri(path = '/auth/login/callback') {
      return `${this.config.hostname}${path}`;
   }

   getConfig(key: keyof IKeycloakConfig): string {
      const value = this.config[key] ?? '';
      return value;
   }

   async isValidToken(token: string): Promise<boolean> {
      const url = this.getEndpoint('introspect');
      const body = new URLSearchParams();
      body.append('token', token);
      body.append('client_id', this.config.clientId);

      if (this.config.clientSecret) {
         body.append('client_secret', this.config.clientSecret);
      }

      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: body.toString(),
      })
         .then((res) => res.json())
         .catch((e) => {
            console.error(e);
            return { active: false, error: e.message };
         });

      // Checando se o token é válido
      if (!('email' in response) || !('access_token' in response)) {
         return false;
      }
      return true;
   }

   async refreshToken(refreshToken: string): Promise<IAccessTokenResponse> {
      const url = this.getEndpoint('refresh');
      const body = new URLSearchParams();
      body.append('grant_type', 'refresh_token');
      body.append('client_id', this.config.clientId);
      body.append('refresh_token', refreshToken);

      // Optional
      if (this.config.clientSecret) {
         body.append('client_secret', this.config.clientSecret);
      }

      const retorno = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: body.toString(),
      }).then((res) => res.json());

      if (retorno && 'error' in retorno) {
         console.error('refresh token error:', retorno);
         throw new Error(retorno.error_description);
      }

      return retorno;
   }
}

export class KeycloakAuthService extends _KeycloakService {
   protected static keycloakAuthService: IKeycloakService;

   static getInstance() {
      if (!KeycloakAuthService.keycloakAuthService) {
         throw new Error('KeycloakAuthService not initialized');
      }

      return KeycloakAuthService.keycloakAuthService;
   }

   static createHandlers(config: IKeycloakConfig) {
      if (!KeycloakAuthService.keycloakAuthService) {
         KeycloakAuthService.keycloakAuthService = new _KeycloakService(config);
      }
      CacheUtils.setProvider(config.persistentProvider);
      return keycloakAuthApiRoutes;
   }

   static getUrlToLogin(pathRedirect: string) {
      return KeycloakAuthService.getInstance().getUrlToLogin(pathRedirect);
   }

   static getAccessToken(code: string, state?: string) {
      return KeycloakAuthService.getInstance().getAccessToken(code, state);
   }

   static getConfig(key: keyof IKeycloakConfig) {
      return KeycloakAuthService.getInstance().getConfig(key);
   }

   static async isValidToken(token: string) {
      return KeycloakAuthService.getInstance().isValidToken(token);
   }

   static async refreshToken(refreshToken: string) {
      return KeycloakAuthService.getInstance().refreshToken(refreshToken);
   }
}
