import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstadosService } from '@shared/services/configuracao/estados.service';
import { Estados } from '@shared/interfaces/configuracao/estados';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EstadoDialogAlterarComponent } from '../dialog/estado-dialog-alterar/estado-dialog-alterar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { EstadoDialogCadastrarComponent } from '../dialog/estado-dialog-cadastrar/estado-dialog-cadastrar.component';

@Component({
  selector: 'app-estados',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.scss',
})
export class EstadosComponent {

  private readonly dialog = inject(MatDialog);
  private readonly estadosService = inject(EstadosService);
  private readonly snacBar = inject(MatSnackBar)


  // 1. Criamos um "gatilho". O valor inicial 'undefined' dispara a primeira busca.
  private refreshList$ = new BehaviorSubject<void>(undefined);

  // 2. O toSignal agora observa o 'refreshList$'.
  // O switchMap garante que, sempre que o gatilho for acionado, chamamos o listarEstados().
  estados = toSignal(
    this.refreshList$.pipe(
      switchMap(() => this.estadosService.listarEstados())
    ),
    { initialValue: [] as Estados[] }
  );

  // 3. Função simples para disparar o gatilho
  recarregarDados() {
    this.refreshList$.next();
  }

  displayedColumns: string[] = ['dsUf', 'dsNome', 'acoes'];

  // estados = toSignal(this.estadosService.listarEstados(), { initialValue: [] as Estados[] });


  editar(estado: Estados) {

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
              panelClass:['success-snackbar']
            });

            this.recarregarDados();

          },
          error: (err) => {
            console.log(err);
            this.snacBar.open('Houve algum problema. Estado não foi atualizado.', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass:['error-snackbar']
            });
          }
        });
      }
    });
  }

  excluir(estado: Estados) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {  nome: estado.dsNome}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
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
              panelClass:['success-snackbar']
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
              panelClass:['error-snackbar']
            });
      }
    });
  }

  cadastrarEstado() {
    const dialogRef = this.dialog.open(EstadoDialogCadastrarComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.estadosService.cadastrarEstado(result).subscribe({
          next: () => {
            this.snacBar.open('Estado cadastrado com sucesso!', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass:['success-snackbar']
            });
            this.recarregarDados();
          },

          error: (err) => {
            console.log(err);
            this.snacBar.open('Houve algum problema. Estado não foi cadastrado.', 'Fechar', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass:['error-snackbar']
            });
          }
        });
      }
    });
  }

}
