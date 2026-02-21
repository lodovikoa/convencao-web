import { inject, Injectable } from '@angular/core';
import { UserCredentials } from '../../interfaces/user-credentials';
import { AuthService } from './auth.service';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { LoggedInUserStoreService } from './logged-in-user-store.service';
import { AuthTokenResponse } from '../../interfaces/auth-token-response';

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {

  private readonly authService = inject(AuthService);
  private readonly authTokenStorageService = inject(AuthTokenStorageService);
  private readonly loggedInUserStoreService = inject(LoggedInUserStoreService);

  login(userCredencials: UserCredentials) {
    return this.authService.login(userCredencials).pipe(this.createUserSession());
  }

  refreshToken(token: string) {
    return this.authService.refreshToken(token).pipe(this.createUserSession());
  }

  logout() {
    return this.authService.logout().pipe(
      tap(() => this.authTokenStorageService.remove()),
      tap(() => this.loggedInUserStoreService.logout())
    );
  }

  private createUserSession() {
    return pipe(
      tap((res: AuthTokenResponse) => this.authTokenStorageService.set(res.token)),
      switchMap((res) => this.authService.getCurrentUser(res.token)),
      tap((user) => this.loggedInUserStoreService.setUser(user))
    );
  }
}
