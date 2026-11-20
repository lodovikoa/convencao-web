import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Cargo } from '@shared/interfaces/configuracao/cargo';
import { CargoService } from '@shared/services/configuracao/cargo.service';
import { LoginFacadeService } from '@shared/services/auth/login-facade.service';
import { SuccessModalComponent } from '@shared/utilitarios/success-modal/success-modal.component';
import { CargoDialogCadastrarComponent } from '../dialog/cargo-dialog-cadastrar/cargo-dialog-cadastrar.component';
import { CargoDialogDetalharComponent } from '../dialog/cargo-dialog-detalhar/cargo-dialog-detalhar.component';


type SortField = 'dsCargo' | 'dsTitulo' | 'convencao';
type SortDirection = 'asc' | 'desc';

export interface CargoDetalharResultado {
  acao: 'atualizado' | 'excluido';
  nomeCargo: string;
}

@Component({
  selector: 'app-cargo-listar',
  imports: [
    CargoDialogCadastrarComponent,
    CargoDialogDetalharComponent,
    SuccessModalComponent,
  ],
  templateUrl: './cargo-listar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cargo-listar.component.scss',
})
export class CargoListarComponent {
  private readonly cargoService = inject(CargoService);
  private readonly loginFacade = inject(LoginFacadeService);

  @ViewChild('cadastrarDialog') protected readonly cadastrarDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('detalharDialog') protected readonly detalharDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('successModal') protected readonly successModal!: SuccessModalComponent;

  protected readonly mensagemSucessoModal = signal<string>('');
  protected readonly cargoSelecionado = signal<Cargo | null>(null);
  protected readonly sortField = signal<SortField>('dsCargo');
  protected readonly sortDirection = signal<SortDirection>('asc');

  protected readonly temPermissaoCadastrar = computed(() =>
    this.loginFacade.hasPermission('T_CFT_MASTER')
  );

  protected readonly cargosResource = rxResource({
    stream: () => this.cargoService.listar(),
  });

  protected readonly isLoading = computed(() => this.cargosResource.isLoading());

  protected readonly cargosList = computed<Cargo[]>(() => {
    const lista = this.cargosResource.value() ?? [];
    const field = this.sortField();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;

    return [...lista].sort((a, b) => {
      const valorA = field === 'convencao'? (a.convencao?.dsReduzido ?? ''): (a[field] ?? '');
      const valorB = field === 'convencao'? (b.convencao?.dsReduzido ?? ''): (b[field] ?? '');

      return valorA.localeCompare(valorB, 'pt-BR', { sensitivity: 'base' }) * dir;
    });
  });

  protected recarregarDados(): void {
    this.cargosResource.reload();
  }

  protected ordenar(coluna: SortField): void {
    if (this.sortField() === coluna) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(coluna);
      this.sortDirection.set('asc');
    }
  }

  protected detalhar(cargo: Cargo): void {
    this.cargoSelecionado.set({ ...cargo });
    this.detalharDialog?.nativeElement.showModal();
  }

  protected fecharDetalharDialog(resultado?: CargoDetalharResultado): void {
    this.detalharDialog?.nativeElement.close();
    this.cargoSelecionado.set(null);

    if (resultado) {
      if (resultado.acao === 'atualizado') {
        this.mensagemSucessoModal.set(`O cargo "${resultado.nomeCargo}" foi atualizado com sucesso.`);
      } else if (resultado.acao === 'excluido') {
        this.mensagemSucessoModal.set( `O cargo "${resultado.nomeCargo}" foi excluído com sucesso.`);
      }
      this.recarregarDados();
      this.successModal?.abrir();
    }
  }

  protected cadastrarCargo(): void {
    this.cadastrarDialog?.nativeElement.showModal();
  }

  protected fecharCadastrarDialog(salvo: boolean, nomeCargo?: string): void {
    this.cadastrarDialog?.nativeElement.close();

    if (salvo) {
      this.mensagemSucessoModal.set(`O cargo "${nomeCargo || 'Cargo'}" foi cadastrado com sucesso.`);
      this.recarregarDados();
      this.successModal?.abrir();
    }
  }

  protected fecharModalSucesso(): void {
    this.successModal?.fechar();
    this.mensagemSucessoModal.set('');
  }
}
