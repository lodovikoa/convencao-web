import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCore } from './core/provide-core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@shared/interceptor/error-interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PortuguesPaginatorIntl } from '@shared/utilitarios/portugues-paginator-intl';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCore(),
    provideHttpClient( withInterceptors([errorInterceptor])),
    { provide: MatPaginatorIntl, useClass: PortuguesPaginatorIntl },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
