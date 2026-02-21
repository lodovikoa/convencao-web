import { inject, provideAppInitializer } from "@angular/core";
import { AuthTokenStorageService } from "../../../shared/services/auth/auth-token-storage.service";
import { of } from "rxjs";
import { LoginFacadeService } from "../../../shared/services/auth/login-facade.service";

export function provideLoggedInUser() {

  return provideAppInitializer(() => {
    const authTokenStorageService = inject(AuthTokenStorageService);

    if (!authTokenStorageService.has()) {
      return of();
    }

    const loginFacadeService = inject(LoginFacadeService);
    const token = authTokenStorageService.get() as string;

    return loginFacadeService.refreshToken(token);
  });
}
