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
import { Estado } from '../../../../../shared/interfaces/configuracao/estado';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-estadocivil-listar',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
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

  cadastrar() {}

  editar(estadocivil: Estadocivil) {}

  excluir(estadocivil: Estadocivil) {}

}
