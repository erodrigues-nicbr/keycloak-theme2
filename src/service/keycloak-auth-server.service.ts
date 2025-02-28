type KeycloakAuthServiceProps = {
   clientId: string;
   realm: string;
   url: string;
   redirectUri: string;
   clientSecret?: string;
};

export default class KeycloakAuthServerService {
   constructor(protected config: KeycloakAuthServiceProps) {}

}
