export interface AuthTokenDetails {
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  email: string;
  realm_access?: {
    roles: string[];
  };
}
