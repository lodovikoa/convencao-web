import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CidadeDialogCadastrarComponent } from '../dialog/cidade-dialog-cadastrar/cidade-dialog-cadastrar.component';

@Component({
  imports: [CommonModule, CidadeDialogCadastrarComponent],
  selector: 'app-cidade',
  styleUrl: './cidade.component.scss',
  templateUrl: './cidade.component.html',
})
export class CidadeComponent {
  private readonly cidadeService = inject(CidadeService);

  @ViewChild('dialogCadastrar') dialogCadastrar!: CidadeDialogCadastrarComponent;

  // Estados reativos com Signal
  protected readonly page = signal<number>(0);
  protected readonly size = signal<number>(10);
  protected readonly loading = signal<boolean>(false);
  protected readonly triggerReload = signal<number>(0);

  // Signals brutos digitados pelo usuário instantaneamente
  protected readonly inputNome = signal<string>('');
  protected readonly inputIbge = signal<string>('');
  protected readonly inputUf = signal<string>('');

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
