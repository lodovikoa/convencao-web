import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EstadoDialogAlterarComponent } from '../dialog/estado-dialog-alterar/estado-dialog-alterar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, switchMap } from 'rxjs';
import { finalize, tap } from 'rxjs/operators'
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { EstadoDialogCadastrarComponent } from '../dialog/estado-dialog-cadastrar/estado-dialog-cadastrar.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';

@Component({
  selector: 'app-estado',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    HasPermissionDirectiveDirective
  ],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.scss',
})
export class EstadoComponent {

  private readonly dialog = inject(MatDialog);
  private readonly estadoService = inject(EstadoService);
  private readonly snacBar = inject(MatSnackBar)

  // Signal para controlar a exibição do spinner
  isLoading = signal(false);

  // 1 - Refreência para o paginador usando a nova sintaxe do Signal (Angular 21)
  paginator = viewChild(MatPaginator);

  // 2 - Criamos o DataSource que a tabela vai usar
  datasource = new MatTableDataSource<Estado>([]);

  // Criamos um "gatilho". O valor inicial 'undefined' dispara a primeira busca.
  private readonly refreshList$ = new BehaviorSubject<{ page: number, size: number, sort: string }>({ page: 0, size: 10, sort: 'dsNome,asc' });

  // O toSignal observa o 'refreshList$'.
  // O switchMap garante que, sempre que o gatilho for acionado, chamamos o listarEstados().
  estadosResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)), // Inicia o loading ao disparar a requisição
      switchMap((params) =>
        this.estadoService.listarEstados(params.page, params.size, params.sort).pipe(
          // delay(2000), // <--- ADICIONE ISSO: Simula um atraso de 2 segundos
          finalize(() => this.isLoading.set(false)) // Desliga o loading ao finalizar (sucesso ou erro)
        ))
    )
  );

  // Função para capturar a mudança de ordenação
  ordenar(event: Sort) {
    if (!event.active || !event.direction) {
      return;
    }

    // Resetar o índice visual do paginador
    const pg = this.paginator();
    if (pg) {
      pg.pageIndex = 0;
    }

    // Disparar a nova busca na API
    this.refreshList$.next({
      ...this.refreshList$.value,
      page: 0, // Resetamos para a primeira página ao ordenar
      sort: `${event.active},${event.direction}`
    });
  }

  // 3 - Função para capturar a mudança de página no HTML
  mudouPagina(event: PageEvent) {
    this.refreshList$.next({
      ...this.refreshList$.value,
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  constructor() {
    // 3 - Efeito que observa mudanças no Signal 'estados' e atualiza o Datasource
    effect(() => {
      const response = this.estadosResponse();

      if (response && response.content) {
        // Alimenta a tabela apenas com a lista de registros
        this.datasource.data = response.content;

        // Sincroniza o pageIndex do component visual com o que veio do servidor
        const pg = this.paginator();
        if (pg && response.pageable) {
          pg.pageIndex = response.pageable.pageNumber;
        }
      }
    });
  }

  // Função para disparar o gatilho
  recarregarDados() {
    const atual = this.refreshList$.value;
    this.refreshList$.next(atual);
  }

  displayedColumns: string[] = ['dsUf', 'dsNome', 'acoes'];

  // Alterar um Estado
  editar(estado: Estado) {

    const dialogRef = this.dialog.open(EstadoDialogAlterarComponent, {
      width: '400px',
      data: { ...estado },  // Passa uma cópia para não alterar a lista original antes da hora
      disableClose: true // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snacBar.open('Estado atualizado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }

    });
  }


  excluir(estado: Estado) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: estado.dsNome }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmarExclusao(estado.id);
      }
    });
  }

  private confirmarExclusao(id: number) {
    this.estadoService.excluirEstado(id).subscribe({
      next: () => {
        this.snacBar.open('Estado excluido com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();

        // Opção B: Remover apenas o item do array local (mais rápido/performático)
        // this.dataSource.data = this.dataSource.data.filter(e => e.id !== id);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  cadastrarEstado() {
    const dialogRef = this.dialog.open(EstadoDialogCadastrarComponent, {
      width: '400px',
      disableClose: true // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snacBar.open('Estado cadastrado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

}
