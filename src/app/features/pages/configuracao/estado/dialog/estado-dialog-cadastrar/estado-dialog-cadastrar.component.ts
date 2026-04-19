import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-estado-form-dialog-cadastrar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './estado-dialog-cadastrar.component.html',
  styleUrl: './estado-dialog-cadastrar.component.scss',
})
export class EstadoDialogCadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly estadoService = inject(EstadoService);
  private readonly dialogRef = inject(MatDialogRef<EstadoDialogCadastrarComponent>);

  isLoading = signal(false);

  estadoForm = this.fb.group({
    dsUf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    dsNome: ['', [Validators.required, Validators.minLength(3)]]
  });

  toUpperCase(field: string) {
    const value = this.estadoForm.get(field)?.value;
    if(value) {
      this.estadoForm.get(field)?.setValue(value.toUpperCase(), {
        emitEvent: false
      });
    }
  }

  onSave(): void {
    if (this.estadoForm.valid) {
      this.isLoading.set(true);

      this.estadoService.cadastrarEstado(this.estadoForm.value as Estado).subscribe({
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

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
