import { CommonModule } from "@angular/common";
import { Component, computed, inject, Input, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { MenuItems } from "../interface/menu-items";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { LoginFacadeService } from "@shared/services/auth/login-facade.service";


@Component({
  selector: 'app-sidenav-items',
  imports: [ CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './sidenav-items.component.html',
  styleUrl: './sidenav-items.component.scss',
})
export class SidenavItemsComponent {

  loginFacadeService = inject(LoginFacadeService);
  userTrancodes = computed(() => this.loginFacadeService.tokenDetalhe()?.realm_access?.roles);

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

// 3. Sua lista completa (Master List)
  private readonly _allMenuItems = signal<MenuItems[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dashboard', trancodes: ['T_CFT_ADMINISTRADOR', 'T_CFT_CONSULTAR'] },
    { icon: 'dashboard', label: 'Configuracao', route: 'configuracao', trancodes: ['T_CFT_ADMINISTRADOR'],
      subItems: [
        { icon: 'dashboard', label: 'Estados', route: 'estadoListar', trancodes: ['T_CFT_ADMINISTRADOR']}
      ]
     },
    {
      icon: 'video_library', label: 'Content', route: 'content', trancodes: ['T_CFT_ADMINISTRADOR'],
      subItems: [
        { icon: 'play_circle', label: 'Videos', route: 'videos', trancodes: ['T_CFT_ADMINISTRADOR'] },
        { icon: 'playlist_play', label: 'Playlists', route: 'playlists', trancodes: ['T_CFT_ADMINISTRADOR'] },
        { icon: 'post_add', label: 'Posts', route: 'posts', trancodes: ['T_CFT_ADMINISTRADOR'] }
      ]
    },
    { icon: 'people', label: 'Users', route: 'users', trancodes: ['ADMIN_USERS'] },
    { icon: 'comments', label: 'Comments', route: 'comments', trancodes: ['T_CFT_ADMINISTRADOR'] } // Sem trancode = Público
  ]);

  // 4. Signal Computado que faz a filtragem reativa
  menuItems = computed(() => {
    return this.filterMenu(this._allMenuItems(), this.userTrancodes() as string[]);
  });

  private filterMenu(items: MenuItems[], userCodes: string[]): MenuItems[] {
    return items
      .filter(item => {
        // 1. Se não tem trancode, é público
        if (!item.trancodes) return true;

        // 2. Normaliza para Array para facilitar a busca
        const requiredCodes = Array.isArray(item.trancodes)
          ? item.trancodes: [item.trancodes];

        // 3. Verifica se o usuário tem PELO MENOS UM dos códigos exigidos
        return requiredCodes.some(code => userCodes.includes(code));
      })
      .map(item => ({
        ...item, subItems: item.subItems ? this.filterMenu(item.subItems, userCodes) : undefined
      }));
  }
}
