import { inject, Injectable, signal, computed } from '@angular/core';
import { UserCredentials } from '../../interfaces/auth/user-credentials';
import { AuthService } from './auth.service';
import { pipe, switchMap, tap, map, of } from 'rxjs';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { LoggedInUserStoreService } from './logged-in-user-store.service';
import { AuthTokenResponse } from '@shared/interfaces/auth/auth-token-response';
import { jwtDecode } from 'jwt-decode';
import { AuthTokenDetails } from '@shared/interfaces/auth/auth-token-details';

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {

  private readonly authService = inject(AuthService);
  private readonly authTokenStorageService = inject(AuthTokenStorageService);
  private readonly loggedInUserStoreService = inject(LoggedInUserStoreService);

  private readonly authTokenDetails = signal<AuthTokenDetails | null>(null);
  tokenDetalhe = computed(() => this.authTokenDetails());


  login(userCredencials: UserCredentials) {

    const tokenTemp = this.authService.login(userCredencials);

     tokenTemp.subscribe({
        next: (retorno) => {
          this.getDecodedToken(retorno.access_token);
        },
        error: (erros) => {
          console.log("Ocorreu erros: ", erros);
        }
      });

    return tokenTemp.pipe(this.createUserSession());
  }

  // Recuperar token do Browser
  recuperaToken(token: string) {
    this.getDecodedToken(token);
    return this.authService.recuperaToken(token).pipe(
      map((res: any) => ({ access_token: res.token } as AuthTokenResponse)),
      this.createUserSession()
    );
  }

  logout() {
    return this.authService.logout().pipe(
      tap(() => this.authTokenStorageService.remove()),
      tap(() => this.loggedInUserStoreService.logout())
    );
  }

  private createUserSession() {
    return pipe(
      tap((res: AuthTokenResponse) =>{ this.authTokenStorageService.set(res.access_token) }),
      switchMap(() => of({ username: this.tokenDetalhe()?.preferred_username as string })),
      tap((user) => this.loggedInUserStoreService.setUser(user))
    );
  }

  // Obter dados do token
   private getDecodedToken(token: string) {
    this.authTokenDetails.set(jwtDecode<AuthTokenDetails>(token));
  }
}
