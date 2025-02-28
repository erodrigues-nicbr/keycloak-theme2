'use client';

import { createContext } from 'react';
import { IKeycloakContext } from '../types/keycloak-context.type';

export const keycloakAuthContext = createContext<IKeycloakContext | null>({
   updateSession: async () => {
      throw new Error('updateSession must be used within a KeycloakProvider');
   },
   useFetch: () => {
      throw new Error('useFetch must be used within a KeycloakProvider');
   },
});
