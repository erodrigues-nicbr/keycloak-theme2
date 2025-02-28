'use client';
import { useContext } from 'react';
import { keycloakAuthContext } from '../context/keycloak-auth.context';

export const useKeycloakAuth = () => {
   const keycloak = useContext(keycloakAuthContext);
   if (!keycloak) {
      throw new Error('useKeycloakAuth must be used within a KeycloakProvider');
   }
   return keycloak;
};
