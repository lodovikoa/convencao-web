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

  // Estado de "collapsed" para controlar se o menu está recolhido ou expandido
  collapsed = signal(false);

  // Simulação de um usuário logado, isso deve ser substituido por uma lógica real de autenticação
  usuarioLogado = signal("Usuario Logado");

  // Texto do título do botão, que muda dinamicamente com base no estado de "collapsed"
  titleText = computed(() => this.collapsed() ? 'Expandir Menu' : 'Recolher Menu');

  // Método para alternar o estado de "collapsed", Recolher o menu ou expandir o menu
  toggle() {
    this.collapsed.update(v => !v);
  }

  // Largura do sidenav, que muda dinamicamente com base no estado de "collapsed"
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');


}
