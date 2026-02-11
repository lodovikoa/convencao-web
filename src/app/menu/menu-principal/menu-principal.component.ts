import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from "@angular/router";
import { CustomSidenavComponent } from "../custom-sidenav/custom-sidenav.component";

@Component({
  selector: 'app-menu-principal',
  imports: [CommonModule, MatToolbarModule, MatBottomSheetModule, MatIconModule, MatSidenavModule, RouterOutlet, CustomSidenavComponent],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss',
})
export class MenuPrincipalComponent {

  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');

}
