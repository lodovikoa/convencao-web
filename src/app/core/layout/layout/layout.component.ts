import { Component, computed, inject, input, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from "@angular/router";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavItemsComponent } from "../sidenav-items/sidenav-items.component";
import { SidenavVisibilityStore } from '../store/sidenav-visibility.store';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, MatSidenavModule, SidenavItemsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {

  private readonly sidenavVisibilityStore = inject(SidenavVisibilityStore);

  // Largura do sidenav, que muda dinamicamente com base no estado de "collapsed"
  sidenavWidth = computed(() => this.sidenavVisibilityStore.isCollapsed() ? '100px' : '250px');
}
