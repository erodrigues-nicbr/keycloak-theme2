'use client';
import { KeycloakAuthProvider } from '<@nicbrasil/auth-keycloak>/context/keycloak-auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export type IKeycloakAuthProps = {
   children: React.ReactNode;
   allowedPages?: string[];
};

const KeycloakAuth: React.FC<IKeycloakAuthProps> = ({ children }) => {
   const router = useRouter();
   useEffect(() => {
      fetch('/auth/session').then((res) => {
         if (res.status === 404) {
            alert('Você não está autenticado');
            router.push('/auth/login');
         }
      });
   }, [router]);
   const updateSession = async () => {
      throw new Error('updateSession must be used within a KeycloakProvider');
   };

   const useFetch = () => {
      throw new Error('useFetch must be used within a KeycloakProvider');
   };

   const keycloak = {
      getAccessToken: () => '',
      login: () => {
         alert('vamos fazer login');
      },
      logout: () => {},
      isAuthenticated: () => false,
   };

   return (
      <KeycloakAuthProvider value={{ keycloak, updateSession, useFetch }}>
         {children}
      </KeycloakAuthProvider>
   );
};

export default KeycloakAuth;
