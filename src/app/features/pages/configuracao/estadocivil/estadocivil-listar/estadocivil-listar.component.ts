import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Estadocivil } from '@shared/interfaces/configuracao/estadocivil';
import { EstadocivilService } from '@shared/services/configuracao/estadocivil.service';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';
import { EstadocivilAlterarComponent } from '../dialog/estadocivil-alterar/estadocivil-alterar.component';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { EstadocivilCadastrarComponent } from '../dialog/estadocivil-cadastrar/estadocivil-cadastrar.component';

@Component({
  selector: 'app-estadocivil-listar',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    HasPermissionDirectiveDirective
  ],
  templateUrl: './estadocivil-listar.component.html',
  styleUrl: './estadocivil-listar.component.scss',
})
export class EstadocivilListarComponent {

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly estadocivilService = inject(EstadocivilService);

  isLoading = signal(false);
  datasource = new MatTableDataSource<Estadocivil>([]);
  displayedColumns: string[] = ['dsEstadoCivil', 'acoes'];

  private readonly refreshList$ = new BehaviorSubject<void>(undefined);

  EstadocivilsResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.estadocivilService.listar().pipe(
        finalize(() => this.isLoading.set(false))
      ))
    )
  );

  constructor() {
    effect(() => {
      const data = this.EstadocivilsResponse();
      if (data) {
        this.datasource.data = data;
      }
    });
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  cadastrar() {
    const dialogRef = this.dialog.open(EstadocivilCadastrarComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Estado Civil cadastrado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

  editar(estadocivil: Estadocivil) {
     const dialogRef = this.dialog.open(EstadocivilAlterarComponent, {
          width: '400px',
          disableClose: true, // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
          data: { ...estadocivil } // Envia cópia para não alterar o datasource antes do tempo
        });

      dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Estado Civil atualizado com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

  excluir(estadocivil: Estadocivil) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: { nome: estadocivil.dsEstadoCivil } // Ajuste para o campo correto da sua interface
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.estadocivilService.excluir(estadocivil.id).subscribe({
              next: () => {
                this.snackBar.open('Estado Civil excluído com sucesso!', 'Fechar', {
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
