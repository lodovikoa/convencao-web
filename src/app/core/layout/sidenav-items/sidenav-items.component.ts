import { CommonModule } from "@angular/common";
import { Component, Input, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { MenuItems } from "../interface/menu-items";
import { MenuItemComponent } from "../menu-item/menu-item.component";


@Component({
  selector: 'app-sidenav-items',
  imports: [ CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './sidenav-items.component.html',
  styleUrl: './sidenav-items.component.scss',
})
export class SidenavItemsComponent {

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItems[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dashboard' },
    { icon: 'video_library', label: 'Content', route: 'content', subItems:
      [
        { icon: 'play_circle', label: 'Videos', route: 'videos'},
        { icon: 'playlist_play', label: 'Playlists', route: 'playlists' },
        { icon: 'post_add', label: 'Posts', route: 'posts' }
      ] },
    { icon: 'people', label: 'Users', route: 'users'},
    { icon: 'comments', label: 'Comments', route: 'comments' }
  ]);

}
