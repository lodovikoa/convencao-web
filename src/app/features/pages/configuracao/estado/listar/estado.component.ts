import { Component, inject, signal, computed, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop'; // Nova API nativa para requisições com Signals
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada'; // Sua interface existente
import { EstadoDialogCadastrarComponent } from '../dialog/estado-dialog-cadastrar/estado-dialog-cadastrar.component';
import { EstadoDialogDetalharComponent } from '../dialog/estado-dialog-detalhar/estado-dialog-detalhar.component';
import { LoginFacadeService } from '@shared/services/auth/login-facade.service';

interface PaginationParams {
  page: number;
  size: number;
  sort: string;
}

@Component({
  selector: 'app-estado',
  imports: [
    EstadoDialogCadastrarComponent,
    EstadoDialogDetalharComponent
  ],
  templateUrl: './estado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './estado.component.scss',
})
export class EstadoComponent {
  private readonly estadoService = inject(EstadoService);
  private readonly loginFacade = inject(LoginFacadeService); // Injetando o serviço real do seu projeto

  @ViewChild('successDialog') protected readonly successDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('cadastrarDialog') protected readonly cadastrarDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('detalharDialog') protected readonly detalharDialog!: ElementRef<HTMLDialogElement>;

  protected readonly mensagemSucessoModal = signal<string>('');
  protected readonly estadoSelecionado = signal<Estado | null>(null);

  // Verificação de permissão centralizada no TS usando o serviço que você já tem
  protected readonly temPermissaoCadastrar = computed(() => this.loginFacade.hasPermission('T_CFT_MASTER'));

// 1. Signal que armazena os parâmetros atuais de paginação/ordenação
  private readonly queryParams = signal<PaginationParams>({ page: 0, size: 10, sort: 'dsNome,asc' });

  // 2. rxResource utilizando `params` e `stream`
  protected readonly estadosResource = rxResource({
    params: () => this.queryParams(),
    stream: ({ params }) => this.estadoService.listarEstados(params.page, params.size, params.sort)
  });

  // 3. Computed para expor o loading diretamente do resource
  protected readonly isLoading = computed(() => this.estadosResource.isLoading());

  // 4. Computed tipado corretamente com a sua interface de resposta paginada
  protected readonly estadosResponse = computed(() => this.estadosResource.value() as RespostaPaginada<Estado> | undefined);

  // 5. Computed para extrair a lista com segurança
  protected readonly estadosList = computed(() => this.estadosResponse()?.content ?? []);

  protected recarregarDados(): void {
    this.estadosResource.reload(); // Recarrega o resource nativamente
  }

  protected ordenar(coluna: string): void {
    const atual = this.queryParams();
    const [col, dir] = atual.sort.split(',');
    const novaDir = col === coluna && dir === 'asc' ? 'desc' : 'asc';

    this.queryParams.set({
      ...atual,
      page: 0,
      sort: `${coluna},${novaDir}`
    });
  }

  protected mudarPagina(pagina: number): void {
    const pageTotal = this.estadosResponse()?.pageable?.pageTotal || 1;
    if (pagina < 0 || pagina >= pageTotal) return;

    this.queryParams.update(atual => ({
      ...atual,
      page: pagina
    }));
  }

  protected mudarItensPorPagina(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const novoSize = Number(selectElement.value);

    this.queryParams.update(atual => ({
      ...atual,
      page: 0,
      size: novoSize
    }));
  }

  protected detalhar(estado: Estado): void {
    this.estadoSelecionado.set({ ...estado });
    this.detalharDialog?.nativeElement.showModal();
  }

  protected fecharDetalharDialog(resultado?: { acao: 'atualizado' | 'excluido'; nomeEstado: string }): void {
    this.detalharDialog?.nativeElement.close();
    this.estadoSelecionado.set(null);

    if (resultado) {
      if (resultado.acao === 'atualizado') {
        this.mensagemSucessoModal.set(`O estado "${resultado.nomeEstado}" foi atualizado com sucesso.`);
      } else if (resultado.acao === 'excluido') {
        this.mensagemSucessoModal.set(`O estado "${resultado.nomeEstado}" foi excluído com sucesso.`);
      }
      this.recarregarDados();
      this.successDialog?.nativeElement.showModal();
    }
  }

  protected cadastrarEstado(): void {
    this.cadastrarDialog?.nativeElement.showModal();
  }

  protected fecharCadastrarDialog(salvo: boolean, nomeEstado?: string): void {
    this.cadastrarDialog?.nativeElement.close();

    if (salvo) {
      this.onEstadoCadastrado(nomeEstado || 'Estado');
    }
  }

  protected onEstadoCadastrado(nomeEstado: string): void {
    this.mensagemSucessoModal.set(`O estado "${nomeEstado}" foi cadastrado com sucesso.`);
    this.recarregarDados();
    this.successDialog?.nativeElement.showModal();
  }

  protected fecharModalSucesso(): void {
    this.successDialog?.nativeElement.close();
    this.mensagemSucessoModal.set('');
  }
}
