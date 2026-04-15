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
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HasPermissionDirectiveDirective } from '@shared/directives/has-permission-directive.directive';

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
  }

  editar(escolaridade: Escolaridade) {
    // Lógica para abrir o diálogo de edição
  }

  excluir(escolaridade: Escolaridade) {
    // Lógica para abrir o diálogo de confirmação e excluir a escolaridade
  }
}
