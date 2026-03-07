import { inject, Injectable } from '@angular/core';
import { SessionStorageToken } from '../../../core/auth/tokens/session-storage-token';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorageService {

  private readonly key: string = 'convencao-auth-token';

  sessionStorageToken = inject(SessionStorageToken);

  set(token: string) {
    this.sessionStorageToken.setItem(this.key, token);
  }

  get(): string | null {
    return this.sessionStorageToken.getItem(this.key);
  }

  has(): boolean {
    return Boolean(this.get());
  }

  remove(): void {
    return this.sessionStorageToken.removeItem(this.key);
  }

}
