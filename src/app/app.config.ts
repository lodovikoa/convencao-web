import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCore } from './core/provide-core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@shared/interceptor/error-interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PortuguesPaginatorIntl } from '@shared/utilitarios/portugues-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCore(),
    provideHttpClient( withInterceptors([errorInterceptor])),
    { provide: MatPaginatorIntl, useClass: PortuguesPaginatorIntl }
  ]
};
