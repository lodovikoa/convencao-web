import { Component, computed, effect, inject, signal, ViewChild, ElementRef, viewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { CidadeDialogCadastrarComponent } from '../dialog/cidade-dialog-cadastrar/cidade-dialog-cadastrar.component';
import { CidadeDialogDetalharComponent } from '../dialog/cidade-dialog-detalhar/cidade-dialog-detalhar.component';
import { SuccessModalComponent } from '@shared/utilitarios/success-modal/success-modal.component';

// Interface do Modelo de Filtros
interface FiltroCidadeModel {
  nome: string;
  ibge: string;
  uf: string;
}

@Component({
  imports: [
    CidadeDialogCadastrarComponent,
    CidadeDialogDetalharComponent,
    SuccessModalComponent
],
  selector: 'app-cidade',
  styleUrl: './cidade.component.scss',
  templateUrl: './cidade.component.html',
})
export class CidadeComponent {
  private readonly cidadeService = inject(CidadeService);

  @ViewChild('dialogCadastrar') protected readonly dialogCadastrar!: CidadeDialogCadastrarComponent;
  @ViewChild('dialogDetalhar') protected readonly dialogDetalhar!: CidadeDialogDetalharComponent;
  @ViewChild('successModal') protected readonly sucessModal!: SuccessModalComponent;

  protected readonly mensagemSucessoModal = signal<string>('');


  // Modelo reativo utilizando Signal puro
  protected readonly filtroModel = signal<FiltroCidadeModel>({
    nome: '',
    ibge: '',
    uf: ''
  });

  // Estados reativos de paginação e controles
  protected readonly page = signal<number>(0);
  protected readonly size = signal<number>(10);
  protected readonly loading = signal<boolean>(false);
  protected readonly triggerReload = signal<number>(0);


  // Signals com debounce aplicados sobre as propriedades do model
  protected readonly filtroNome = toSignal(
    toObservable(computed(() => this.filtroModel().nome)).pipe(debounceTime(1000), distinctUntilChanged()),
    { initialValue: '' }
  );

  protected readonly filtroIbge = toSignal(
    toObservable(computed(() => this.filtroModel().ibge)).pipe(debounceTime(1000), distinctUntilChanged()),
    { initialValue: '' }
  );

  protected readonly filtroUf = toSignal(
    toObservable(computed(() => {
      const uf = this.filtroModel().uf.trim();
      return uf.length === 2 ? uf : '';
    })).pipe(debounceTime(500), distinctUntilChanged()),
    { initialValue: '' }
  );

  protected readonly cidades = signal<Cidade[]>([]);
  protected readonly paginaAtual = signal<RespostaPaginada<Cidade> | null>(null);

  // Computed properties para paginação e controle visual
  protected readonly totalPages = computed(() => this.paginaAtual()?.pageable.pageTotal ?? 0);
  protected readonly totalElements = computed(() => this.paginaAtual()?.pageable.elementsTotal ?? 0);
  protected readonly isFirst = computed(() => this.paginaAtual()?.pageable.pageFirst ?? true);
  protected readonly isLast = computed(() => this.paginaAtual()?.pageable.pageLast ?? true);

  constructor() {
    effect(() => {
      const currentPage = this.page();
      const currentSize = this.size();
      const nome = this.filtroNome();
      const ibge = this.filtroIbge();
      const uf = this.filtroUf();
      this.triggerReload();

      this.carregarCidades(currentPage, currentSize, nome, ibge, uf);
    });
  }

  protected carregarCidades(page: number, size: number, nome?: string, ibge?: string, uf?: string): void {
    this.loading.set(true);
    this.cidadeService.listarPaginado(page, size, nome, ibge, uf).subscribe({
      next: (response) => {
        this.cidades.set(response.content);
        this.paginaAtual.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar cidades:', err);
        this.loading.set(false);
      }
    });
  }

  // Atualizador reativo centralizado do model de filtros
  protected atualizarFiltro(campo: keyof FiltroCidadeModel, event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value;

    this.page.set(0);

    if (campo === 'uf') {
      valor = valor.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
      input.value = valor;
    }

    this.filtroModel.update(model => ({
      ...model,
      [campo]: valor
    }));
  }

  protected abrirModalCadastrar(): void {
    if (this.dialogCadastrar) {
      this.dialogCadastrar.abrir();
    }
  }

  protected abrirModalDetalhar(id: number): void {
    if (this.dialogDetalhar) {
      this.dialogDetalhar.abrir(id);
    }
  }

  protected onCidadeCadastrada(nomeCidade: string): void {
    this.mensagemSucessoModal.set(`A cidade "${nomeCidade}" foi cadastrada com sucesso.`);
    this.recarregarLista();
    this.sucessModal?.abrir();
  }

  protected onCidadeAtualizada(nomeCidade: string): void {
    this.mensagemSucessoModal.set(`A cidade "${nomeCidade}" foi atualizada com sucesso.`);
    this.recarregarLista();
    this.sucessModal?.abrir();
  }

  protected onCidadeExcluida(nomeCidade: string): void {
    this.mensagemSucessoModal.set(`A cidade "${nomeCidade}" foi excluída com sucesso.`);
    this.recarregarLista();
    this.sucessModal?.abrir();
  }

  protected fecharModalSucesso(): void {
    this.sucessModal?.fechar();
    this.mensagemSucessoModal.set('');
  }

  protected recarregarLista(): void {
    this.triggerReload.update(v => v + 1);
  }

  protected mudarPagina(novaPagina: number): void {
    if (novaPagina >= 0 && novaPagina < this.totalPages()) {
      this.page.set(novaPagina);
    }
  }

  protected mudarTamanho(event: Event): void {
    const novoTamanho = Number((event.target as HTMLSelectElement).value);
    this.size.set(novoTamanho);
    this.page.set(0);
  }
}
