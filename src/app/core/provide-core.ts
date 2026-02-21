import { makeEnvironmentProviders } from "@angular/core";
import { provideAuth } from "./auth/provide-auth";
import { setAuthTokenInterceptor } from "./auth/interceptors/set-auth-token-interceptor";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

export function provideCore() {
  return makeEnvironmentProviders([
    provideAuth(),
    provideHttpClient(withInterceptors([setAuthTokenInterceptor])),
  ]);
}
