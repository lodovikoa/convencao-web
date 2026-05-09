import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EstadoService } from '@shared/services/configuracao/estado.service';

@Component({
  selector: 'app-estado-form-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './estado-dialog-alterar.component.html',
  styleUrl: './estado-dialog-alterar.component.scss',
})
export class EstadoDialogAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly estadoService = inject(EstadoService);
  private readonly dialogRef = inject(MatDialogRef<EstadoDialogAlterarComponent>);

  isLoading = signal(false);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Estado) {
    this.form = this.fb.group({
      id: [data.id],
      dsUf: [data.dsUf, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      dsNome: [data.dsNome, [Validators.required, Validators.minLength(3)]]
    });
  }

  converterParaMaiusculo() {
    const valor = this.form.get('dsUf')?.value;
    if(valor) {
      this.form.get('dsUf')?.setValue(valor.toUpperCase(), {
        emitEvent: false
      });
    }
  }

  onSave() {
    if(this.form.valid) {
      this.isLoading.set(true);

      this.estadoService.editarEstado(this.form.value as Estado).subscribe({
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

  onCancel() {
    this.dialogRef.close();
  }

}
