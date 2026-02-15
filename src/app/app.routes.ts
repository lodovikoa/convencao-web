import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContentComponent } from './pages/content/content.component';
import { UsersComponent } from './pages/users/users.component';
import { VideosComponent } from './pages/content/videos/videos.component';
import { PlaylistsComponent } from './pages/content/playlists/playlists.component';
import { PostsComponent } from './pages/content/posts/posts.component';
import { ComentsComponent } from './pages/coments/coments.component';

export const routes: Routes = [
  { path: '',  pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'content', component: ContentComponent,
    children: [
      { path: 'videos', component: VideosComponent },
      { path: 'playlists', component: PlaylistsComponent },
      { path: 'posts', component: PostsComponent }
    ]
   },
  { path: 'users', component: UsersComponent },
  { path: 'coments', component: ComentsComponent }

];
