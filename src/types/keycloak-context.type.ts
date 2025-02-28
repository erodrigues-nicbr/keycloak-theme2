export type IKeycloakContext = {
   updateSession: () => Promise<void>;
   useFetch: () => (url: string, options?: RequestInit) => Promise<Response>;
};
