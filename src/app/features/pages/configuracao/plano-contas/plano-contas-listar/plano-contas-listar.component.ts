import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { PlanoContas } from '@shared/interfaces/configuracao/plano-contas';
import { PlanoContasService } from '@shared/services/configuracao/plano-contas.service';
import { BehaviorSubject, tap, switchMap, finalize } from 'rxjs';
import { PlanoContasAlterarComponent } from '../dialog/plano-contas-alterar/plano-contas-alterar.component';
import { PlanoContasCadastrarComponent } from '../dialog/plano-contas-cadastrar/plano-contas-cadastrar.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-plano-contas-listar',
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
  templateUrl: './plano-contas-listar.component.html',
  styleUrl: './plano-contas-listar.component.scss',
})
export class PlanoContasListarComponent {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly Service = inject(PlanoContasService);

  @ViewChild(MatSort) sort!: MatSort; // Referência para o MatSort

  isLoading = signal(false);
  datasource = new MatTableDataSource<PlanoContas>([]);
  displayedColumns: string[] = ['cdConta', 'dsConta', 'tpConta', 'convencao.dsReduzido', 'acoes'];

  private refreshList$ = new BehaviorSubject<void>(undefined);

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
    if(!event.active || !event.direction) {
      return;
    }
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  cadastrar() {
    const dialogRef = this.dialog.open(PlanoContasCadastrarComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Plano de Constas cadastrado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.recarregarDados();
      }
    });
  }

  editar(entity: PlanoContas) {
    const dialogRef = this.dialog.open(PlanoContasAlterarComponent, {
      width: '600px',
      disableClose: true,
      data: { ...entity }
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Plano de Contas atualizado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

  excluir(entity: PlanoContas) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: entity.dsConta }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Service.excluir(entity.id).subscribe({
          next: () => {
            this.snackBar.open('Departamento excluído com sucesso!', 'Fechar', {
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
