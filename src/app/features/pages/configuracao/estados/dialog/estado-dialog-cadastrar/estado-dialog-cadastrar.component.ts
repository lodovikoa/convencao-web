import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-estado-form-dialog-cadastrar',
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './estado-dialog-cadastrar.component.html',
  styleUrl: './estado-dialog-cadastrar.component.scss',
})
export class EstadoDialogCadastrarComponent {
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EstadoDialogCadastrarComponent>);

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

  onCancel(): void {
    this.dialogRef.close();
  }
}
