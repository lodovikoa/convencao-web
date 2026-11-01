import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/auth/guards/is-authenticated-guard';

export const routes: Routes = [
  //{ path: '', canActivate: [isAuthenticatedGuard], loadComponent: () => import('./core/layout/layout/layout.component').then(m => m.LayoutComponent),
  { path: '', canActivate: [isAuthenticatedGuard], loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {  path: '', loadChildren: () => import('./features/pages/routes') },
    ]
  },

  { path: 'auth', loadChildren: () => import('./core/auth/routes') },

];
