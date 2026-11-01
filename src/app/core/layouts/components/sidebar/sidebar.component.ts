import { Component, input, output, InputSignal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginFacadeService } from '@shared/services/auth/login-facade.service';

interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  route?: string;
  trancodes?: string[];
  subItems?: MenuItem[];
}

@Component({
  imports: [RouterLink],
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  // Recuperar token
  private loginFacadeService = inject(LoginFacadeService);
  private userTrancodes = computed(() => this.loginFacadeService.tokenDetalhe()?.realm_access?.roles);

  // Tipagem explícita do Input Signal para evitar falhas no typechecker do Angular
  isOpen: InputSignal<boolean> = input.required<boolean>();
  expandedSubmenuId: InputSignal<string | null> = input<string | null>(null);

  toggle = output<void>();
  submenuToggle = output<string>();
  itemClick = output<void>();

  rawMenuList: MenuItem[] = [
     {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route:'/dashboard',
      trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR', 'T_CFT_CONSULTAR']
    },
    {
      id: 'configuracao',
      title: 'Configuracao',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      subItems: [
         { id: 'convencao', title: 'Convenção', route: '/configuracao/convencaoListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'departamento', title: 'Departamentos', route: '/configuracao/departamentoListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'estado', title: 'Estados', route: '/configuracao/estadoListar', trancodes: ['TTT_CFT_MASTER', 'TTT_CFT_ADMINISTRADOR'] },
         { id: 'escolaridade', title: 'Escolaridades', route: '/configuracao/escolaridadeListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'cargo', title: 'Cargos', route: '/configuracao/cargoListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'estadocivil', title: 'Estado Civil', route: '/configuracao/estadocivilListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'profissao', title: 'Profissões', route: '/configuracao/profissaoListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'planocontas', title: 'Plano de Contas', route: '/configuracao/planoContasListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'tipolancamento', title: 'Tipo de Lançamento', route: '/configuracao/tipoLancamentoListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] },
         { id: 'regiao', title: 'Regiao', route: '/configuracao/regiaoListar', trancodes: ['T_CFT_MASTER', 'T_CFT_ADMINISTRADOR'] }
        ]
    },
    {
      id: 'customers',
      title: 'Clientes',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2, 0 014 0z',
      subItems: [
        { id: 'gerenciar', title: 'Gerenciar Clientes', route: '/customers/list' },
        { id: 'segmentos', title: 'Segmentos', route: '/customers/segments' }
      ]
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      route: '/settings'
    }
  ];

  // Computed signal que filtra automaticamente os menus com base nas regras de trancodes
  menuList = computed(() => {
    const roles = this.userTrancodes();

    const hasAccess = (trancodes?: string[]): boolean => {
      // Se não houver trancodes opcionais configurados, exibe por padrão
      if (!trancodes || trancodes.length === 0) {
        return true;
      }
      // Verifica se pelo menos um dos trancodes do item está presente nas roles do usuário
      console.log('trancodes aplicação:', trancodes, ' Roles do usuário:', roles);
      return trancodes.some(code => roles?.includes(code));
    };

    return this.rawMenuList
      .map(item => {
        // Se o item possui subItems, filtramos os subItems primeiro
        if (item.subItems && item.subItems.length > 0) {
          const filteredSubItems = item.subItems.filter(sub => hasAccess(sub.trancodes));

          // Se o item pai tem subitens, mas todos foram filtrados/removidos, retornamos null para omitir o pai também
          if (filteredSubItems.length === 0) {
            return null;
          }

          return { ...item, subItems: filteredSubItems };
        }

        // Se for um item normal, validamos o acesso dele
        return hasAccess(item.trancodes) ? item : null;
      })
      .filter((item): item is MenuItem => item !== null); // Remove os nulos da lista final
  });

  toggleSubmenu(id: string) {
    this.submenuToggle.emit(id);
  }

  onItemClick() {
    this.itemClick.emit();
  }
}
