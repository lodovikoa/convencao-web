import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { PlanoContas } from '@shared/interfaces/configuracao/plano-contas';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { PlanoContasService } from '@shared/services/configuracao/plano-contas.service';

@Component({
  selector: 'app-plano-contas-cadastrar',
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
  templateUrl: './plano-contas-cadastrar.component.html',
  styleUrl: './plano-contas-cadastrar.component.scss',
})
export class PlanoContasCadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PlanoContasCadastrarComponent>);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly Service = inject(PlanoContasService);

  isLoading = signal(false);

  convencaos = toSignal(this.convencaoService.listarConvencao(), { initialValue: [] as Convencao[] });

  form: FormGroup = this.fb.group({
    cdConta: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
    dsConta: ['', [Validators.required, Validators.maxLength(100)]],
    tpConta: ['', [Validators.required, Validators.maxLength(1), Validators.pattern(/^[DC]$/)]],
    convencaoId: ['', [Validators.required]]
  });

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading.set(true);
    this.Service.cadastrar(this.form.value as PlanoContas).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
