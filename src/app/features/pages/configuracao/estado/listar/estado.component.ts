import { Component, inject, signal, computed, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop'; // Nova API nativa para requisições com Signals
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada'; // Sua interface existente
import { EstadoDialogCadastrarComponent } from '../dialog/estado-dialog-cadastrar/estado-dialog-cadastrar.component';
import { EstadoDialogDetalharComponent } from '../dialog/estado-dialog-detalhar/estado-dialog-detalhar.component';
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';

interface PaginationParams {
  page: number;
  size: number;
  sort: string;
}

@Component({
  selector: 'app-estado',
  imports: [
    HasPermissionDirectiveDirective,
    EstadoDialogCadastrarComponent,
    EstadoDialogDetalharComponent
  ],
  templateUrl: './estado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './estado.component.scss',
})
export class EstadoComponent {
  private readonly estadoService = inject(EstadoService);

  @ViewChild('successDialog') public readonly successDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('cadastrarDialog') public readonly cadastrarDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('detalharDialog') public readonly detalharDialog!: ElementRef<HTMLDialogElement>;

  public readonly mensagemSucessoModal = signal<string>('');
  public readonly estadoSelecionado = signal<Estado | null>(null);

// 1. Signal que armazena os parâmetros atuais de paginação/ordenação
  private readonly queryParams = signal<PaginationParams>({ page: 0, size: 10, sort: 'dsNome,asc' });

  // 2. rxResource utilizando `params` e `stream`
  public readonly estadosResource = rxResource({
    params: () => this.queryParams(),
    stream: ({ params }) => this.estadoService.listarEstados(params.page, params.size, params.sort)
  });

  // 3. Computed para expor o loading diretamente do resource
  public readonly isLoading = computed(() => this.estadosResource.isLoading());

  // 4. Computed tipado corretamente com a sua interface de resposta paginada
  public readonly estadosResponse = computed(() => this.estadosResource.value() as RespostaPaginada<Estado> | undefined);

  // 5. Computed para extrair a lista com segurança
  public readonly estadosList = computed(() => this.estadosResponse()?.content ?? []);

  public recarregarDados(): void {
    this.estadosResource.reload(); // Recarrega o resource nativamente
  }

  public ordenar(coluna: string): void {
    const atual = this.queryParams();
    const [col, dir] = atual.sort.split(',');
    const novaDir = col === coluna && dir === 'asc' ? 'desc' : 'asc';

    this.queryParams.set({
      ...atual,
      page: 0,
      sort: `${coluna},${novaDir}`
    });
  }

  public mudarPagina(pagina: number): void {
    const pageTotal = this.estadosResponse()?.pageable?.pageTotal || 1;
    if (pagina < 0 || pagina >= pageTotal) return;

    this.queryParams.update(atual => ({
      ...atual,
      page: pagina
    }));
  }

  public mudarItensPorPagina(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const novoSize = Number(selectElement.value);

    this.queryParams.update(atual => ({
      ...atual,
      page: 0,
      size: novoSize
    }));
  }

  public detalhar(estado: Estado): void {
    this.estadoSelecionado.set({ ...estado });
    this.detalharDialog?.nativeElement.showModal();
  }

  public fecharDetalharDialog(resultado?: { acao: 'atualizado' | 'excluido'; nomeEstado: string }): void {
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

  public cadastrarEstado(): void {
    this.cadastrarDialog?.nativeElement.showModal();
  }

  public fecharCadastrarDialog(salvo: boolean, nomeEstado?: string): void {
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
