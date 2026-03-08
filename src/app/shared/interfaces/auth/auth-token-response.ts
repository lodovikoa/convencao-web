export interface AuthTokenResponse {
  access_token: string;
  expires_in: string;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: string;
  session_state: string;
  scope: string;
}
