import { CommonModule } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Profissao } from '@shared/interfaces/configuracao/profissao';
import { ProfissaoService } from '@shared/services/configuracao/profissao.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-profissao-alterar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgxMaskDirective
  ],
  providers: [ provideNgxMask() ],
  templateUrl: './profissao-alterar.component.html',
  styleUrl: './profissao-alterar.component.scss',
})
export class ProfissaoAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly profissaoService = inject(ProfissaoService);
  private readonly dialogoRef = inject(MatDialogRef<ProfissaoAlterarComponent>);

  isLoading = signal(false);

  form: FormGroup;

  constructor (@Inject(MAT_DIALOG_DATA) public data: Profissao) {
    this.form = this.fb.group({
      id: [data.id],
      dsDescricao: [data.dsDescricao, [Validators.required, Validators.maxLength(150)]],
      dsCBO: [data.dsCBO, [Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSave() {
    if(this.form.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.profissaoService.editar(this.form.value as Profissao).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogoRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });
  }

  onCancel() {
    this.dialogoRef.close();
  }
}
