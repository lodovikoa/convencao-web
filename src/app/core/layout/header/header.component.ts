import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { LoginFacadeService } from '../../../shared/services/auth/login-facade.service';
import { Router } from '@angular/router';
import { LoggedInUserStoreService } from '../../../shared/services/auth/logged-in-user-store.service';
import { SidenavVisibilityService } from '../store/sidenav-visibility.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  private readonly loginFacadeService = inject(LoginFacadeService);
  private readonly router = inject(Router);
  private readonly loggedInUserStoreService = inject(LoggedInUserStoreService);

  isLoggedIn = computed(() => this.loggedInUserStoreService.isLoggedIn());
  usuarioLogado = computed(() => this.loggedInUserStoreService.currenteUser()?.userName);

  private readonly sidenavVisibilityService = inject(SidenavVisibilityService);

  // Método para alternar o estado de "collapsed", Recolher o menu ou expandir o menu
  toggleSidenavCollapsed() {
    this.sidenavVisibilityService.toggle();
  }

   // Texto do título do botão, que muda dinamicamente com base no estado de "collapsed"
  titleText = computed(() => this.sidenavVisibilityService.isCollapsed() ? 'Expandir Menu' : 'Recolher Menu');

  logout() {
    this.loginFacadeService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
