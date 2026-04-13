import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, switchMap } from 'rxjs';
import { filter, finalize, tap } from 'rxjs/operators'
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConvencaoDialogDetalharComponent } from '../dialog/convencao-dialog-detalhar/convencao-dialog-detalhar.component';
import { ConvencaoDialogAlterarComponent } from '../dialog/convencao-dialog-alterar/convencao-dialog-alterar.component';
import { ConvencaoDialogCadastrarComponent } from '../dialog/convencao-dialog-cadastrar/convencao-dialog-cadastrar.component';
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';

@Component({
  selector: 'app-convencao',
  standalone: true,
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
  templateUrl: './convencao.component.html',
  styleUrl: './convencao.component.scss',
})
export class ConvencaoComponent {
  private readonly dialog = inject(MatDialog);
  private readonly convencaoService = inject(ConvencaoService);

  isLoading = signal(false);
  datasource = new MatTableDataSource<Convencao>([]);
  displayedColumns: string[] = ['dsReduzido', 'dsConvencao', 'estado.dsUf', 'acoes']; // Ajuste conforme sua interface

  // Gatilho simples (void) para recarregar a lista
  private refreshList$ = new BehaviorSubject<void>(undefined);

  // Transforma o Observable em Signal. O switchMap chama o listar que retorna Convencao[]
  convencoesResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.convencaoService.listarConvencao().pipe(
        finalize(() => this.isLoading.set(false))
      ))
    )
  );

  constructor() {
    // Efeito para atualizar o datasource sempre que o sinal de convenções mudar
    effect(() => {
      const data = this.convencoesResponse();
      if (data) {
        this.datasource.data = data;
      }
    });
  }

  recarregarDados() {
    this.refreshList$.next();
  }

  visualizar(convencao: Convencao) {
    this.dialog.open(ConvencaoDialogDetalharComponent, {
      width: '600px',
      data:convencao // Passa a convenção selecionada para o diálogo de detalhes
    });
  }

  cadastrar() {
    // Exemplo genérico - ajuste para seu componente de cadastro
    const dialogRef = this.dialog.open(ConvencaoDialogCadastrarComponent, {
      width: '800px',
      disableClose: true // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading.set(true);
        this.convencaoService.cadastrarConvencao(result).subscribe({
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

  editar(convencao: Convencao) {
  const dialogRef = this.dialog.open(ConvencaoDialogAlterarComponent, {
    width: '800px',
    disableClose: true, // Impede fechar clicando fora ou com ESC, forçando o usuário a escolher Salvar ou Cancelar
    data: { ...convencao } // Envia cópia para não alterar o datasource antes do tempo
  });

  dialogRef.afterClosed()
    .pipe(filter(result => !!result)) // Só continua se o usuário clicou em Salvar
    .subscribe(dadosAtualizados => {
      this.convencaoService.editarConvencao(dadosAtualizados).subscribe({
        next: () => {
          this.recarregarDados();
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  excluir(convencao: Convencao) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: convencao.dsReduzido } // Ajuste para o campo correto da sua interface
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.convencaoService.excluirConvencao(convencao.id).subscribe({
          next: () => {
            this.recarregarDados();
          }
        });
      }
    });
  }
}
