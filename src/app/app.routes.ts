import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/auth/guards/is-authenticated-guard';

export const routes: Routes = [
  { path: '', canActivate: [isAuthenticatedGuard], loadComponent: () => import('./core/layout/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {  path: '', loadChildren: () => import('./features/pages/routes') },
    ]
  },

  { path: 'auth', loadChildren: () => import('./core/auth/routes') },

];
