import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CidadeDialogCadastrarComponent } from '../dialog/cidade-dialog-cadastrar/cidade-dialog-cadastrar.component';
import { CidadeDialogDetalharComponent } from '../dialog/cidade-dialog-detalhar/cidade-dialog-detalhar.component';

@Component({
  imports: [CommonModule, CidadeDialogCadastrarComponent, CidadeDialogDetalharComponent],
  selector: 'app-cidade',
  styleUrl: './cidade.component.scss',
  templateUrl: './cidade.component.html',
})
export class CidadeComponent {
  private readonly cidadeService = inject(CidadeService);

  @ViewChild('dialogCadastrar') dialogCadastrar!: CidadeDialogCadastrarComponent;
  @ViewChild('dialogDetalhar') dialogDetalhar!: CidadeDialogDetalharComponent;
  @ViewChild('successDialog') successDialog!: ElementRef<HTMLDialogElement>;

  // Estados reativos com Signal
  protected readonly page = signal<number>(0);
  protected readonly size = signal<number>(10);
  protected readonly loading = signal<boolean>(false);
  protected readonly triggerReload = signal<number>(0);

  // Controle do modal de sucesso de exclusão
  protected readonly cidadeExcluidaNome = signal<string>('');

  // Signals brutos digitados pelo usuário instantaneamente
  protected readonly inputNome = signal<string>('');
  protected readonly inputIbge = signal<string>('');
  protected readonly inputUf = signal<string>('');
  protected readonly mensagemSucessoModal = signal<string>('');

  // Signals com debounce de 1000ms aplicados automaticamente usando toObservable + toSignal
  protected readonly filtroNome = toSignal(
    toObservable(this.inputNome).pipe(debounceTime(1000), distinctUntilChanged()),
    { initialValue: '' }
  );

  protected readonly filtroIbge = toSignal(
    toObservable(this.inputIbge).pipe(debounceTime(1000), distinctUntilChanged()),
    { initialValue: '' }
  );

  protected readonly filtroUf = toSignal(
    toObservable(this.inputUf).pipe(distinctUntilChanged()),
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

  protected atualizarFiltro(tipo: 'nome' | 'ibge' | 'uf', event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value;

    this.page.set(0);

    if (tipo === 'nome') {
      this.inputNome.set(valor);
    } else if (tipo === 'ibge') {
      this.inputIbge.set(valor);
    } else if (tipo === 'uf') {
      valor = valor.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
      input.value = valor;

      if (valor.length === 2) {
        this.inputUf.set(valor);
      } else {
        this.inputUf.set('');
      }
    }
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

    // Disparado quando o modal de cadastro é concluído com sucesso
  protected onCidadeCadastrada(nomeCidade: string): void {
    this.mensagemSucessoModal.set(`A cidade "${nomeCidade}" foi cadastrada com sucesso.`);
    this.recarregarLista();

    if(this.successDialog) {
      this.successDialog.nativeElement.showModal();
    }
  }

  // Disparado quando o modal de detalhes conclui a edição com sucesso
  protected onCidadeAtualizada(nomeCidade: string): void {
    this.mensagemSucessoModal.set(`A cidade "${nomeCidade}" foi atualizada com sucesso.`);
    this.recarregarLista();

    if(this.successDialog) {
      this.successDialog.nativeElement.showModal();
    }
  }

  // Disparado quando o modal de detalhes confirma a exclusão
  protected onCidadeExcluida(nomeCidade: string): void {
    this.mensagemSucessoModal.set(`A cidade "${nomeCidade}" foi excluída com sucesso.`);
    this.recarregarLista();

    // Abre o modal nativo DaisyUI de sucesso
    if(this.successDialog) {
      this.successDialog.nativeElement.showModal();
    }
  }

  protected fecharModalSucesso(): void {
    if(this.successDialog) {
      this.successDialog.nativeElement.close();
    }
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
