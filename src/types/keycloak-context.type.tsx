import { IKeycloakInstance } from './keycloak-instance.type';

export type IKeycloakContext = {
   updateSession: () => Promise<void>;
   useFetch: () => (url: string, options?: RequestInit) => Promise<Response>;
   keycloak: IKeycloakInstance;
   
};
