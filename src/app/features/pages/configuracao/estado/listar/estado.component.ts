import { Component, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstadosService } from '@shared/services/configuracao/estados.service';
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
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { EstadoDialogCadastrarComponent } from '../dialog/estado-dialog-cadastrar/estado-dialog-cadastrar.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-estado',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSnackBarModule, MatPaginatorModule],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.scss',
})
export class EstadoComponent {

  private readonly dialog = inject(MatDialog);
  private readonly estadosService = inject(EstadosService);
  private readonly snacBar = inject(MatSnackBar)

  // 1 - Refreência para o paginador usando a nova sintaxe do Signal (Angular 21)
  paginator = viewChild(MatPaginator);

  // 2 - Criamos o DataSource que a tabela vai usar
  datasource = new MatTableDataSource<Estado>([]);

  // Criamos um "gatilho". O valor inicial 'undefined' dispara a primeira busca.
  private refreshList$ = new BehaviorSubject<{page: number, size: number}>({page: 0, size: 10});

  // O toSignal observa o 'refreshList$'.
  // O switchMap garante que, sempre que o gatilho for acionado, chamamos o listarEstados().
  estadosResponse = toSignal(
    this.refreshList$.pipe(
      switchMap((params) => this.estadosService.listarEstados(params.page, params.size))
    )
    // { initialValue: [] as Estado[] }
  );

  // 3 - Função para capturar a mudança de página no HTML
  mudouPagina(event: PageEvent) {
    this.refreshList$.next({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  constructor() {
    // 3 - Efeito que observa mudanças no Signal 'estados' e atualiza o Datasource
    effect(() => {
      const response = this.estadosResponse();
      // this.datasource.data = listaSincronizada;

      if (response && response.content) {
        // Alimenta a tabela apenas com a lista de registros
        this.datasource.data = response.content;

        // Conecta o paginador (Paginação no Front-end com os dados recebidos)
        // if (this.paginator()) {
        //   this.datasource.paginator = this.paginator()!;
        // }
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
      data: { ...estado }  // Passa uma cópia para não alterar a lista original antes da hora
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estadosService.editarEstado(result).subscribe({
          next: (estadoAtualizado) => {
            this.snacBar.open('Estado atualizado com sucesso!', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });

            this.recarregarDados();

          },
          error: (err) => {
            console.log(err);
            // this.snacBar.open('Houve algum problema. Estado não foi atualizado.', 'Fechar', {
            //   duration: 10000,
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   panelClass:['error-snackbar']
            // });
          }
        });
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
    this.estadosService.excluirEstado(id).subscribe({
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
        this.snacBar.open('Houve algum problema. Estado não foi atualizado.', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Cadastrar novo Estado
  cadastrarEstado() {
    const dialogRef = this.dialog.open(EstadoDialogCadastrarComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estadosService.cadastrarEstado(result).subscribe({
          next: () => {
            this.snacBar.open('Estado cadastrado com sucesso!', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.recarregarDados();
          },

          error: (err) => {
            console.log(err);
            // this.snacBar.open('Houve algum problema. Estado não foi cadastrado.', 'Fechar', {
            //   duration: 10000,
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   panelClass:['error-snackbar']
            // });
          }
        });
      }
    });
  }

}
