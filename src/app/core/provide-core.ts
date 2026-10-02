import { makeEnvironmentProviders } from "@angular/core";
import { provideAuth } from "./auth/provide-auth";
import { setAuthTokenInterceptor } from "./auth/interceptors/set-auth-token-interceptor";
import { provideHttpClient, withInterceptors, withXhr } from "@angular/common/http";

export function provideCore() {
  return makeEnvironmentProviders([
    provideAuth(),
    provideHttpClient(withXhr(), withInterceptors([setAuthTokenInterceptor])),
  ]);
}
