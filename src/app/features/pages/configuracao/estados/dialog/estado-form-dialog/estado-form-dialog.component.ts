import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Estados } from '@shared/interfaces/configuracao/estados';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-estado-form-dialog',
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './estado-form-dialog.component.html',
  styleUrl: './estado-form-dialog.component.scss',
})
export class EstadoFormDialogComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EstadoFormDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Estados) {
    this.form = this.fb.group({
      id: [data.id],
      uf: [data.uf, [Validators.required, Validators.minLength(2)]],
      nome: [data.nome, Validators.required]
    });
  }

  salvar() {
    if(this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

}
