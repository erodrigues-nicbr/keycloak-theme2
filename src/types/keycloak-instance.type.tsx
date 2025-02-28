export type IKeycloakInstance = {
   getAccessToken: () => string;
   login: () => void;
   logout: () => void;
   isAuthenticated: () => boolean;
};
