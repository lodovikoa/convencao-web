import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/auth/guards/is-authenticated-guard';

export const routes: Routes = [
  { path: '', canActivate: [isAuthenticatedGuard], loadComponent: () => import('./core/layout/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {  path: '', loadChildren: () => import('./features/pages/routes') },
    ]
  },

  { path: 'auth', loadChildren: () => import('./core/auth/routes') },

  // { path: '',  pathMatch: 'full', redirectTo: 'login' },
  // { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'content', component: ContentComponent,
  //   children: [
  //     { path: 'videos', component: VideosComponent },
  //     { path: 'playlists', component: PlaylistsComponent },
  //     { path: 'posts', component: PostsComponent }
  //   ]
  //  },
  // { path: 'users', component: UsersComponent },
  // { path: 'comments', component: CommentsComponent }

];
