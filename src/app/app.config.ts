import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCore } from './core/provide-core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@shared/interceptor/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCore(),
    provideHttpClient( withInterceptors([errorInterceptor]))
  ]
};
