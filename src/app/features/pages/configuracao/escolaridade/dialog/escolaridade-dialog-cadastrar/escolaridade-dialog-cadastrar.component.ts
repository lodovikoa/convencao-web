import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EscolaridadeService } from '../../../../../../shared/services/configuracao/escolaridade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Escolaridade } from '@shared/interfaces/configuracao/escolaridade';

@Component({
  selector: 'app-escolaridade-dialog-cadastrar',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './escolaridade-dialog-cadastrar.component.html',
  styleUrl: './escolaridade-dialog-cadastrar.component.scss',
})
export class EscolaridadeDialogCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EscolaridadeDialogCadastrarComponent>);
  private readonly escolaridadeService = inject(EscolaridadeService);

  escolaridades = toSignal(this.escolaridadeService.listarEscolaridades(), { initialValue: [] as Escolaridade[] });

  form: FormGroup = this.fb.group({
    dsDescricao: ['', [Validators.required, Validators.maxLength(40)]],
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
