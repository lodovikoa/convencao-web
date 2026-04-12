import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Departamento } from '@shared/interfaces/configuracao/departamento';
import { DepartamentoService } from '@shared/services/configuracao/departamento.service';
import { BehaviorSubject, filter, finalize, switchMap, tap } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DepartamentoDialogCadastrarComponent } from '../dialog/departamento-dialog-cadastrar/departamento-dialog-cadastrar.component';
import { DepartamentoDialogAlterarComponent } from '../dialog/departamento-dialog-alterar/departamento-dialog-alterar.component';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-departamento',
  imports: [    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule],
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.scss',
})
export class DepartamentoComponent {

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly departamentoService = inject(DepartamentoService);

  isLoading = signal(false);
  datasource = new MatTableDataSource<Departamento>([]);
  displayedColumns: string[] = ['dsReduzido', 'dsDepartamento', 'convencao.dsReduzido', 'acoes'];

  // Gatilho simples (void) para recarregar a lista
  private refreshList$ = new BehaviorSubject<void>(undefined);

  departamentosResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.departamentoService.listarDepartamentos().pipe(
        finalize(() => this.isLoading.set(false))
      ))
    )
  );

  constructor() {
    // Efeito para atualizar o datasource sempre que o sinal de departamentos mudar

    effect(() => {
      const data = this.departamentosResponse();
      if (data) {
        this.datasource.data = data;
      }
    });
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  cadastrar() {
     // Exemplo genérico - ajuste para seu componente de cadastro
    const dialogRef = this.dialog.open(DepartamentoDialogCadastrarComponent, {
      width: '600px',
      disableClose: true // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
     });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading.set(true);
        this.departamentoService.cadastrarDepartamento(result).subscribe({
          next: () => {
            this.recarregarDados();
          },
          error: (err) => {
            console.error(err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  editar(departamento: Departamento) {
    // Lógica para abrir o diálogo de edição
    const dialogRef = this.dialog.open(DepartamentoDialogAlterarComponent, {
        width: '600px',
        disableClose: true, // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
        data: { ...departamento } // Envia cópia para não alterar o datasource antes do tempo
      });

      dialogRef.afterClosed()
        .pipe(filter(result => !!result)) // Só continua se o usuário clicou em Salvar
        .subscribe(dadosAtualizados => {
          this.departamentoService.editarDepartamento(dadosAtualizados).subscribe({
            next: () => {
              this.recarregarDados();
            },
            error: (err) => {
              console.error(err);
            }
          });
        });
  }

  excluir(departamento: Departamento) {
    // Lógica para abrir o diálogo de confirmação e excluir o departamento
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: departamento.dsReduzido } // Ajuste para o campo correto da sua interface
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departamentoService.excluirDepartamento(departamento.id).subscribe({
          next: () => {
            this.recarregarDados();
          }
        });
      }
    });
  }

}
