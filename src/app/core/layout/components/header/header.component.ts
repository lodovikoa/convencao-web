import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginFacadeService } from '@shared/services/auth/login-facade.service';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.component.scss',
  standalone: true,
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  private readonly loginFacadeService = inject(LoginFacadeService);
  private readonly router = inject(Router);

  companyName = input.required<string>();
  userName = input.required<string>();
  userRole = input.required<string>();
  userInitials = input.required<string>();
  currentTheme = input.required<'light' | 'dark'>();

  protected toggleSidebar = output<void>();
  protected toggleTheme = output<void>();

  // Controla o estado aberto/fechado do dropdown de forma reativa
  isDropdownOpen = signal<boolean>(false);

  toggleDropdown() {
    this.isDropdownOpen.update(value => !value);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  logout() {
    this.closeDropdown();
    this.loginFacadeService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
