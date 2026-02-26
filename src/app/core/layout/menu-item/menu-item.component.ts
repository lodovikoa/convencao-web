import { Component, computed, inject, input, signal } from '@angular/core';
import { MenuItems } from '../interface/menu-items';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidenavVisibilityStore } from '../store/sidenav-visibility.store';

@Component({
  selector: 'app-menu-item',
  imports: [ MatListModule, RouterModule, MatIconModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})

export class MenuItemComponent {

   private readonly sidenavVisibilityStore = inject(SidenavVisibilityStore);
   collapsedLocal = computed(() => this.sidenavVisibilityStore.isCollapsed());

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
