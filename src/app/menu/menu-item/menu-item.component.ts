import { Component, computed, input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../interface/menu-item';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-item',
  imports: [MatListModule, RouterModule, MatIconModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {

  item = input.required<MenuItem>();
  collapsed = input<boolean>(false);
  nestedMenuOpen = signal(false);

  toggleNested() {
    if(!this.item().subItems) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

}
