import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';
import { ProfissaoService } from '../../../../../shared/services/configuracao/profissao.service';
import { Profissao } from '@shared/interfaces/configuracao/profissao';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfissaoCadastrarComponent } from '../dialog/profissao-cadastrar/profissao-cadastrar.component';
import { ProfissaoAlterarComponent } from '../dialog/profissao-alterar/profissao-alterar.component';
import { ConfirmDialogComponent } from '@features/pages/dialogo/confirm-dialog/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-profissao-listar',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    HasPermissionDirectiveDirective,
    NgxMaskPipe
  ],
  providers: [provideNgxMask()],
  templateUrl: './profissao-listar.component.html',
  styleUrl: './profissao-listar.component.scss',
})
export class ProfissaoListarComponent {

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly ProfissaoService = inject(ProfissaoService);

  isLoading = signal(false);

  // 1 - Refreência para o paginador usando a nova sintaxe do Signal (Angular 21)
  paginator = viewChild(MatPaginator);

  datasource = new MatTableDataSource<Profissao>([]);

  // Criamos um "gatilho". O valor inicial 'undefined' dispara a primeira busca.
  private readonly refreshList$ = new BehaviorSubject<{ page: number, size: number, sort: string }>({ page: 0, size: 10, sort: 'dsDescricao,asc' });

  displayedColumns: string[] = ['dsDescricao', 'dsCBO', 'acoes'];


  profissoesResponse = toSignal(
    this.refreshList$.pipe(
      tap(() => this.isLoading.set(true)), // Inicia o loading ao disparar a requisição
      switchMap((params) =>
        this.ProfissaoService.listar(params.page, params.size, params.sort).pipe(
          // delay(2000), // <--- ADICIONE ISSO: Simula um atraso de 2 segundos
          finalize(() => this.isLoading.set(false)) // Desliga o loading ao finalizar (sucesso ou erro)
        ))
    )
  );

  // Função para capturar a mudança de ordenação
  ordenar(event: Sort) {
    if (!event.active || !event.direction) {
      return;
    }

  // Resetar o índice visual do paginador
    const pg = this.paginator();
    if (pg) {
      pg.pageIndex = 0;
    }

    // Disparar a nova busca na API
    this.refreshList$.next({
      ...this.refreshList$.value,
      page: 0, // Resetamos para a primeira página ao ordenar
      sort: `${event.active},${event.direction}`
    });
  }

  // 3 - Função para capturar a mudança de página no HTML
  mudouPagina(event: PageEvent) {
    this.refreshList$.next({
      ...this.refreshList$.value,
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  constructor() {
    // 3 - Efeito que observa mudanças no Signal 'estados' e atualiza o Datasource
    effect(() => {
      const response = this.profissoesResponse();

      if (response && response.content) {
        // Alimenta a tabela apenas com a lista de registros
        this.datasource.data = response.content;

        // Sincroniza o pageIndex do component visual com o que veio do servidor
        const pg = this.paginator();
        if (pg && response.pageable) {
          pg.pageIndex = response.pageable.pageNumber;
        }
      }
    });
  }

  // Função para disparar o gatilho
  recarregarDados() {
    const atual = this.refreshList$.value;
    this.refreshList$.next(atual);
  }

  cadastrar() {
    const dialogRef = this.dialog.open(ProfissaoCadastrarComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Profissão cadastrada com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

  editar(profissao: Profissao) {
    const dialogRef = this.dialog.open(ProfissaoAlterarComponent, {
      width: '400px',
      disableClose: true,
      data: { ...profissao }
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Profissão atualizada com sucesso!', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.recarregarDados();
      }
    });
  }

  excluir(profissao: Profissao) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        disableClose: true,
        data: { message: 'Tem certeza que deseja excluir a profissão?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.ProfissaoService.excluir(profissao.id).subscribe({
            next: () => {
              this.snackBar.open('Profissão excluída com sucesso!', 'Fechar', {
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
