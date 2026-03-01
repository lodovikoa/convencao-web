import { Component, computed, inject, input, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from "@angular/router";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavItemsComponent } from "../sidenav-items/sidenav-items.component";
import { SidenavVisibilityService } from '../store/sidenav-visibility.service';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, MatSidenavModule, SidenavItemsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {

  private readonly sidenavVisibilityService = inject(SidenavVisibilityService);

  // Largura do sidenav, que muda dinamicamente com base no estado de "collapsed"
  sidenavWidth = computed(() => this.sidenavVisibilityService.isCollapsed() ? '75px' : '250px');
}
