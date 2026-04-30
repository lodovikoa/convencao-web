import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EscolaridadeService } from '../../../../../../shared/services/configuracao/escolaridade.service';
import { Escolaridade } from '@shared/interfaces/configuracao/escolaridade';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-escolaridade-dialog-cadastrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './escolaridade-dialog-cadastrar.component.html',
  styleUrl: './escolaridade-dialog-cadastrar.component.scss',
})
export class EscolaridadeDialogCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EscolaridadeDialogCadastrarComponent>);
  private readonly escolaridadeService = inject(EscolaridadeService);

  isLoading = signal(false);

  form: FormGroup = this.fb.group({
    dsDescricao: ['', [Validators.required, Validators.maxLength(40)]],
  });

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.escolaridadeService.cadastrarEscolaridade(this.form.value as Escolaridade).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });

  }

  onCancel () {
    this.dialogRef.close(null);
  }
}
