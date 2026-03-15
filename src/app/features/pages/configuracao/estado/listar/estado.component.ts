import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstadosService } from '@shared/services/configuracao/estados.service';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { MatTableModule } from '@angular/material/table';
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

@Component({
  selector: 'app-estado',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.scss',
})
export class EstadoComponent {

  private readonly dialog = inject(MatDialog);
  private readonly estadosService = inject(EstadosService);
  private readonly snacBar = inject(MatSnackBar)


  // Criamos um "gatilho". O valor inicial 'undefined' dispara a primeira busca.
  private refreshList$ = new BehaviorSubject<void>(undefined);

  // O toSignal observa o 'refreshList$'.
  // O switchMap garante que, sempre que o gatilho for acionado, chamamos o listarEstados().
  estados = toSignal(
    this.refreshList$.pipe(
      switchMap(() => this.estadosService.listarEstados())
    ),
    { initialValue: [] as Estado[] }
  );

  // Função para disparar o gatilho
  recarregarDados() {
    this.refreshList$.next();
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
              panelClass:['success-snackbar']
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

  // Cadastrar novo Estado
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
