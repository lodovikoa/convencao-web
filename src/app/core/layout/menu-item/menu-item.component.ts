import { Component, computed, inject, input, signal } from '@angular/core';
import { MenuItems } from '../interface/menu-items';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidenavVisibilityService } from '../store/sidenav-visibility.service';

@Component({
  selector: 'app-menu-item',
  imports: [ MatListModule, RouterModule, MatIconModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})

export class MenuItemComponent {

   private readonly sidenavVisibilityService = inject(SidenavVisibilityService);
   collapsedMenu = computed(() => this.sidenavVisibilityService.isCollapsed());

  item = input.required<MenuItems>();
  collapsed = input<boolean>(false);
  nestedMenuOpen = signal(false);

  toggleNested() {
    if (!this.item().subItems) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }
}
