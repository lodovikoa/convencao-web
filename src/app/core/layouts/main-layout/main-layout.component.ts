import { Component, signal, effect, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  selector: 'app-main-layout',
  styleUrl: './main-layout.component.scss',
  standalone: true,
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  isSidebarOpen = signal<boolean>(true);
  expandedSubmenuId = signal<string | null>(null);

  companyName = signal<string>('Tech Enterprise Inc.');
  userName = signal<string>('Ludovico Ardissão');
  userRole = signal<string>('Administrador');

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
