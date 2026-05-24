import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TipoLancamento } from '@shared/interfaces/configuracao/tipo-lancamento';
import { TipoLancamentoService } from '@shared/services/configuracao/tipo-lancamento.service';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { TipoLancamentoCadastrarComponent } from '../dialog/tipo-lancamento-cadastrar/tipo-lancamento-cadastrar.component';
import { TipoLancamentoAlterarComponent } from '../dialog/tipo-lancamento-alterar/tipo-lancamento-alterar.component';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tipo-lancamento-listar',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tipo-lancamento-listar.component.html',
  styleUrl: './tipo-lancamento-listar.component.scss',
})
export class TipoLancamentoListarComponent {

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly Service = inject(TipoLancamentoService);

  @ViewChild(MatSort) sort!: MatSort; // Referência para o MatSort

  isLoading = signal(false);
  datasource = new MatTableDataSource<TipoLancamento>([]);
  displayedColumns: string[] = ['dsTipoLancamento', 'vlTipoLancamento', 'planoContas.dsConta', 'planoContas.tpConta', 'convencao.dsReduzido', 'acoes'];

  private readonly refreshList$ = new BehaviorSubject<void>(undefined);

  response = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.Service.listar().pipe(
        finalize(() => this.isLoading.set(false))
      ))
    )
  );

  constructor() {
    effect(() => {
      const data = this.response();
      if (data) {
        this.datasource.data = data;

        // 3. Vincula o sort ao datasource assim que os dados chegam
        this.datasource.sort = this.sort;

        // 4. ESSENCIAL: Lógica para conseguir ordenar colunas com "sub-objetos" (convencao.dsReduzido)
        this.datasource.sortingDataAccessor = (item: any, property: string) => {
          if (property.includes('.')) {
            return property.split('.').reduce((obj, key) => obj?.[key], item);
          }
          return item[property];
        };
      }
    });
  }

  ordenar(event: Sort) {
    if (!event.active || !event.direction) {
      return;
    }
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  cadastrar() {
    const dialogRef = this.dialog.open(TipoLancamentoCadastrarComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Tipo de Lançamento cadastrado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.recarregarDados();
      }
    });
  }

  editar(entity: TipoLancamento) {
    const dialogRef = this.dialog.open(TipoLancamentoAlterarComponent, {
      width: '600px',
      disableClose: true,
      data: { ...entity }
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Tipo de Lançamento atualizado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

  excluir(entity: TipoLancamento) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: entity.dsTipoLancamento }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Service.excluir(entity.id).subscribe({
          next: () => {
            this.snackBar.open('Tipo de Lançamento excluído com sucesso!', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.recarregarDados();
          }
        });
      }
    });
  }
}
