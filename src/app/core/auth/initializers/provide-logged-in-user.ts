import { inject, provideAppInitializer } from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { LoggedInUserStoreService } from "../../../shared/services/auth/logged-in-user-store.service";
import { AuthTokenStorageService } from "../../../shared/services/auth/auth-token-storage.service";
import { of, switchMap, tap } from "rxjs";

export function provideLoggedInUser() {

  return provideAppInitializer(() => {
    const authTokenStorageService = inject(AuthTokenStorageService);

    if (!authTokenStorageService.has()) {
      return of();
    }

    const authService = inject(AuthService);
    const loggedInUserStoreService = inject(LoggedInUserStoreService);
    const token = authTokenStorageService.get() as string;

    return authService.refreshToken(token)
      .pipe(
        tap((res) => authTokenStorageService.set(res.token)),
        switchMap((res) => authService.getCurrentUser(res.token)),
        tap((user) => loggedInUserStoreService.setUser(user))
      )
  });
}
