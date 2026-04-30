import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Estadocivil } from '@shared/interfaces/configuracao/estadocivil';
import { EstadocivilService } from '@shared/services/configuracao/estadocivil.service';

@Component({
  selector: 'app-estadocivil-alterar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './estadocivil-alterar.component.html',
  styleUrl: './estadocivil-alterar.component.scss',
})
export class EstadocivilAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly estadoCivilService = inject(EstadocivilService);
  private readonly dialogRef = inject(MatDialogRef<EstadocivilAlterarComponent>);
  readonly data: Estadocivil = inject(MAT_DIALOG_DATA);

  isLoading = signal(false);

  form!: FormGroup;

  estadoCivils = signal<Estadocivil[]>([]); // Sinal para armazenar as EstadoCivils

  ngOnInit(): void {
    this.carregarEstadoCivils();

    this.form = this.fb.group({
      id: [this.data.id],
      dsEstadoCivil: [this.data.dsEstadoCivil, [Validators.required, Validators.maxLength(30)]],
    });
  }

  private carregarEstadoCivils(): void {
    this.estadoCivilService.listar().subscribe(result => {
      this.estadoCivils.set(result);
    });
  }

  comparar(elemento1: Estadocivil | null, elemento2: Estadocivil | null): boolean {
    // Se ambos forem nulos, são iguais
    if (elemento1 === null && elemento2 === null) return true;

    // Se um for nulo e o outro não, são diferentes
    if (elemento1 === null || elemento2 === null) return false;

    // Se ambos existem, compara pelo ID
    return elemento1.id === elemento2.id;
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.estadoCivilService.editar(this.form.value as Estadocivil).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });

  }

}
