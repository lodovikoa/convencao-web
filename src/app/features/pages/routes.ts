import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CommentsComponent } from "./comments/comments.component";
import { UsersComponent } from "./users/users.component";
import { ContentComponent } from "./content/content.component";
import { VideosComponent } from "./content/videos/videos.component";
import { PlaylistsComponent } from "./content/playlists/playlists.component";
import { PostsComponent } from "./content/posts/posts.component";
import { HomeComponent } from "./home/home.component";

export default [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'comments', component: CommentsComponent},
  { path: 'users', component: UsersComponent },
  { path: 'content', component: ContentComponent,
    children: [
      { path: 'videos', component: VideosComponent },
      { path: 'playlists', component: PlaylistsComponent },
      { path: 'posts', component: PostsComponent }
    ]
   }
] as Routes;
