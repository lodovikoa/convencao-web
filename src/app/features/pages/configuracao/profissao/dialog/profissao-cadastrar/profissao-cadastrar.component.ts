import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Profissao } from '@shared/interfaces/configuracao/profissao';
import { ProfissaoService } from '@shared/services/configuracao/profissao.service';

@Component({
  selector: 'app-profissao-cadastrar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profissao-cadastrar.component.html',
  styleUrl: './profissao-cadastrar.component.scss',
})
export class ProfissaoCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProfissaoCadastrarComponent>);
  private readonly profissaoService = inject(ProfissaoService);

  isLoading = signal(false);

  profissaoForm = this.fb.group({
    dsDescricao: ['', [Validators.required, Validators.maxLength(150)]],
    dsCBO: ['', [Validators.minLength(6), Validators.maxLength(6)]],
  });

  onSave(): void {
    if (!this.profissaoForm.valid) {
      return
    }

    this.isLoading.set(true);

    this.profissaoService.cadastrar(this.profissaoForm.value as Profissao).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
