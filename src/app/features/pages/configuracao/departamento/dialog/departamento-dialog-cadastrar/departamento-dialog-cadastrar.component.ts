import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';

@Component({
  selector: 'app-departamento-dialog-cadastrar',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './departamento-dialog-cadastrar.component.html',
  styleUrl: './departamento-dialog-cadastrar.component.scss',
})
export class DepartamentoDialogCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DepartamentoDialogCadastrarComponent>);
  private readonly convencaoService = inject(ConvencaoService);

  convencaos = toSignal(this.convencaoService.listarConvencao(), { initialValue: [] as Convencao[] });

  form: FormGroup = this.fb.group({
    dsReduzido: ['', [Validators.required, Validators.maxLength(20)]],
    dsDepartamento: ['', [Validators.required, Validators.maxLength(100)]],
    convencaoId: ['', [Validators.required]]
  });

  salvar() {
    if (this.form.valid) {
      // Retorna os dados do formulário para o componente pai
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }

}
