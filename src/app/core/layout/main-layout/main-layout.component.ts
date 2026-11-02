import { Component, signal, effect, HostListener, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LoginFacadeService } from '../../../shared/services/auth/login-facade.service';

@Component({
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  selector: 'app-main-layout',
  styleUrl: './main-layout.component.scss',
  standalone: true,
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {

  private readonly loginFacadeService = inject(LoginFacadeService);

  isSidebarOpen = signal<boolean>(true);
  expandedSubmenuId = signal<string | null>(null);

  companyName = signal<string>('CONFRATERES');

  // Transformado em computed para reagir dinamicamente quando o usuário logar/deslogar
  userName = computed(() => this.loginFacadeService.tokenDetalhe()?.name.trim() || 'Não identificado');
  userRole = computed(() => this.loginFacadeService.tokenDetalhe()?.user_type || 'Não identificado');

  userInitials = computed(() => {
    const name = this.userName();
    if (!name) return 'ND';
    const parts = name.split(/\s+/);

    // Se o nome tiver apenas uma palavra, retorna as duas primeiras letras em maiúsculas
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    const firsInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return firsInitial + lastInitial;
  });


  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        this.isSidebarOpen.set(false);
      }

      effect(() => {
        const theme = this.currentTheme();
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('preferred-theme', theme);
      });

      const savedTheme = localStorage.getItem('preferred-theme') as 'light' | 'dark';
      if (savedTheme) {
        this.currentTheme.set(savedTheme);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width < 640) {
      this.isSidebarOpen.set(false);
    } else {
      this.isSidebarOpen.set(true);
    }
  }

  toggleTheme() {
    this.currentTheme.update(theme => (theme === 'light' ? 'dark' : 'light'));
  }

  toggleSidebar() {
    this.isSidebarOpen.update(state => !state);
  }

  toggleSubmenu(id: string) {
    this.expandedSubmenuId.update(current => (current === id ? null : id));
  }

  onItemClick() {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      this.isSidebarOpen.set(false);
    }
  }
}
