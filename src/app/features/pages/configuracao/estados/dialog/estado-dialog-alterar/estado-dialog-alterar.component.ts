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
  templateUrl: './estado-dialog-alterar.component.html',
  styleUrl: './estado-dialog-alterar.component.scss',
})
export class EstadoDialogAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EstadoDialogAlterarComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Estados) {
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

  salvar() {
    if(this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

}
