'use client';
import { KeycloakAuthProvider } from '<@nicbrasil/auth-keycloak>/context/keycloak-auth.provider';
import { useEffect, useState } from 'react';

export type IKeycloakAuthProps = {
   children: React.ReactNode;
   allowedPages?: string[];
};

const KeycloakAuth: React.FC<IKeycloakAuthProps> = ({ children }) => {
   const [authenticated, setAuthenticated] = useState(false);

   const updateSession = async () => {
      throw new Error('updateSession must be used within a KeycloakProvider');
   };

   const useFetch = () => {
      throw new Error('useFetch must be used within a KeycloakProvider');
   };
   useEffect(() => {
      fetch('/auth/session')
         .then((response) => {
            if (response.ok) {
               return response.json();
            }

            throw new Error('Not authenticated');
         })
         .then(() => {
            setAuthenticated(true);
         })
         .catch(() => {
            window.location.href =
               '/auth/login?redirect=' + window.location.pathname;
         });
   }, []);

   return (
      <KeycloakAuthProvider value={{ updateSession, useFetch }}>
         {authenticated ? children : 'Carregando...'}
      </KeycloakAuthProvider>
   );
};
export default KeycloakAuth;
