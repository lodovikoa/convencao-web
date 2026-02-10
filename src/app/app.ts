import { Component, signal } from '@angular/core';
import { MenuPrincipalComponent } from "./menu/menu-principal/menu-principal.component";

@Component({
  selector: 'app-root',
  imports: [MenuPrincipalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('convencao-web');
}
