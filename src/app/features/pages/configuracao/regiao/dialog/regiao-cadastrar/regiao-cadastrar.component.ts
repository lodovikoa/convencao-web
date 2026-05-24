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
import { Regiao } from '@shared/interfaces/configuracao/regiao';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { RegiaoService } from '@shared/services/configuracao/regiao.service';

@Component({
  selector: 'app-regiao-cadastrar',
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
  templateUrl: './regiao-cadastrar.component.html',
  styleUrl: './regiao-cadastrar.component.scss',
})
export class RegiaoCadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<RegiaoCadastrarComponent>);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly service = inject(RegiaoService);

  isLoading = signal(false);

  convencaos = toSignal(this.convencaoService.listarConvencao(), { initialValue: [] as Convencao[] });

  form: FormGroup = this.fb.group({
    dsRegiao: ['', [Validators.required, Validators.maxLength(50)]],
    convencaoId: [null, [Validators.required]]
  });

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading.set(true);
    this.service.cadastrar(this.form.value as Regiao).subscribe({
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
