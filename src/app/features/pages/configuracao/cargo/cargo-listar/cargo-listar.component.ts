import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cargo } from '@shared/interfaces/configuracao/cargo';
import { CargoService } from '@shared/services/configuracao/cargo.service';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { CargoDialogCadastrarComponent } from '../dialog/cargo-dialog-cadastrar/cargo-dialog-cadastrar.component';
import { CargoDialogAlterarComponent } from '../dialog/cargo-dialog-alterar/cargo-dialog-alterar.component';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cargo-listar',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cargo-listar.component.html',
  styleUrl: './cargo-listar.component.scss',
})
export class CargoListarComponent {

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cargoService = inject(CargoService);

  isLoading = signal(false);
  datasource = new MatTableDataSource<Cargo>([]);
  displayedColumns: string[] = ['dsCargo', 'dsTitulo', 'convencao.dsReduzido', 'acoes'];

  private readonly refreshList$ = new BehaviorSubject<void>(undefined);

  cargosResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.cargoService.listar().pipe(
        finalize(() => this.isLoading.set(false))
      ))
    )
  );

  constructor() {
    effect(() => {
      const data = this.cargosResponse();
      if (data) {
        this.datasource.data = data;
      }
    });
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  cadastrar() {
    // Implementar lógica de cadastro
    const dialogRef = this.dialog.open(CargoDialogCadastrarComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Cargo cadastrado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.recarregarDados();
      }
    });
  }

  editar(cargo: Cargo) {
    // Implementar lógica de edição
    const dialogRef = this.dialog.open(CargoDialogAlterarComponent, {
      width: '400px',
      disableClose: true,
      data: { ...cargo } // Passa o cargo para o diálogo de edição
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Cargo atualizado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.recarregarDados();
      }
    });
  }

  excluir(cargo: Cargo) {
    // Implementar lógica de exclusão
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: cargo.dsCargo,
        titulo: 'Confirmar Exclusão'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargoService.excluir(cargo.id).subscribe({
          next: () => {
            this.snackBar.open('Cargo excluído com sucesso!', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
            this.recarregarDados();
          }
        });
      }
    });

  }
}
