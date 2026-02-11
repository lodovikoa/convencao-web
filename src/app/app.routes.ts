import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContentComponent } from './pages/content/content.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  { path: '',  pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'content', component: ContentComponent },
  { path: 'users', component: UsersComponent }

];
