import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoggedInUserStoreService } from '../../../shared/services/auth/logged-in-user-store.service';
import { AuthTokenStorageService } from '../../../shared/services/auth/auth-token-storage.service';

export const setAuthTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const loggedInUserStoreService = inject(LoggedInUserStoreService);

  if(!loggedInUserStoreService.isLoggedIn()) {
    return next(req);
  }

  const authTokenStorageService = inject(AuthTokenStorageService);
  const token = authTokenStorageService.get();

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(newReq);
};
