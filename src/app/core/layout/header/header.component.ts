import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { LoginFacadeService } from '../../../shared/services/auth/login-facade.service';
import { Router } from '@angular/router';
import { LoggedInUserStoreService } from '../../../shared/services/auth/logged-in-user-store.service';

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

  toggle() {

  }

  logout() {
    this.loginFacadeService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
