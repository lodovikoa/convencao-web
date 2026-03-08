import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { UserCredentials } from '../../interfaces/auth/user-credentials';
import { AuthTokenResponse } from '../../interfaces/auth/auth-token-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/login';

  login(payload: UserCredentials): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(this.apiUrl, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  recuperaToken(token: string) {
    return of({ token: token });
  }

  logout() {
    return of(null);
  }

}
