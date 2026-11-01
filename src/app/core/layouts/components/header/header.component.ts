import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.component.scss',
  standalone: true,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  companyName = input.required<string>();
  userName = input.required<string>();
  userRole = input.required<string>();
  currentTheme = input.required<'light' | 'dark'>();

  toggleSidebar = output<void>();
  toggleTheme = output<void>();
}
