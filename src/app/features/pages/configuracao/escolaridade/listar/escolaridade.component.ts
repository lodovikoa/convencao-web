import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EscolaridadeService } from '@shared/services/configuracao/escolaridade.service';
import { Escolaridade } from '@shared/interfaces/configuracao/escolaridade';
import { BehaviorSubject, filter, finalize, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';
import { EscolaridadeDialogCadastrarComponent } from '../dialog/escolaridade-dialog-cadastrar/escolaridade-dialog-cadastrar.component';
import { EscolaridadeDialogAlterarComponent } from '../dialog/escolaridade-dialog-alterar/escolaridade-dialog-alterar.component';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-escolaridade',
  imports: [ CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    HasPermissionDirectiveDirective
  ],
  templateUrl: './escolaridade.component.html',
  styleUrl: './escolaridade.component.scss',
})
export class EscolaridadeComponent {

  private readonly dialog = inject(MatDialog);
  private readonly escolaridadeService = inject(EscolaridadeService);

  isLoading = signal(false);
  datasource = new MatTableDataSource<Escolaridade>([]);
  displayedColumns: string[] = ['dsDescricao', 'acoes'];

  // Recarregar a lista de escolaridades
  private refreshList$ = new BehaviorSubject<void>(undefined);

  escolaridadesResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.escolaridadeService.listarEscolaridades().pipe(
        finalize(() => this.isLoading.set(false))
      ))
    )
  );

  constructor() {
    // Atualizar o datasource sempre que o sinal de escolaridades mudar
    effect(() => {
      const data = this.escolaridadesResponse();
      if (data) {
        this.datasource.data = data;
      }
    });
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  cadastrar() {
    // Lógica para abrir o diálogo de cadastro
      const dialogRef = this.dialog.open(EscolaridadeDialogCadastrarComponent, {
        width: '600px',
        disableClose: true // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
       });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isLoading.set(true);
          this.escolaridadeService.cadastrarEscolaridade(result).subscribe({
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

  editar(escolaridade: Escolaridade) {
    // Lógica para abrir o diálogo de edição
      const dialogRef = this.dialog.open(EscolaridadeDialogAlterarComponent, {
          width: '600px',
          disableClose: true, // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
          data: { ...escolaridade } // Envia cópia para não alterar o datasource antes do tempo
        });

        dialogRef.afterClosed()
          .pipe(filter(result => !!result)) // Só continua se o usuário clicou em Salvar
          .subscribe(dadosAtualizados => {
            this.escolaridadeService.editarEscolaridade(dadosAtualizados).subscribe({
              next: () => {
                this.recarregarDados();
              },
              error: (err) => {
                console.error(err);
              }
            });
          });
  }

  excluir(escolaridade: Escolaridade) {
    // Lógica para abrir o diálogo de confirmação e excluir a escolaridade
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { nome: escolaridade.dsDescricao } // Ajuste para o campo correto da sua interface
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.escolaridadeService.excluirEscolaridade(escolaridade.id).subscribe({
            next: () => {
              this.recarregarDados();
            }
          });
        }
      });
  }
}
