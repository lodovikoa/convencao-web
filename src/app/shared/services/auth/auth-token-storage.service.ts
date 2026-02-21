import { inject, Injectable } from '@angular/core';
import { LocalStorageToken } from '../../../core/auth/tokens/local-storage-token';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorageService {

  private readonly key: string = 'convencao-auth-token';

  localStorageToken = inject(LocalStorageToken);

  set(token: string) {
    this.localStorageToken.setItem(this.key, token);
  }

  get(): string | null {
    return this.localStorageToken.getItem(this.key);
  }

  has(): boolean {
    return Boolean(this.get());
  }

  remove(): void {
    return this.localStorageToken.removeItem(this.key);
  }

}
