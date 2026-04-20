import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { Departamento } from '@shared/interfaces/configuracao/departamento';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { DepartamentoService } from '@shared/services/configuracao/departamento.service';

@Component({
  selector: 'app-departamento-dialog-cadastrar',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './departamento-dialog-cadastrar.component.html',
  styleUrl: './departamento-dialog-cadastrar.component.scss',
})
export class DepartamentoDialogCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DepartamentoDialogCadastrarComponent>);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly departamentoService = inject(DepartamentoService);

  isLoading = signal(false);

  convencaos = toSignal(this.convencaoService.listarConvencao(), { initialValue: [] as Convencao[] });

  form: FormGroup = this.fb.group({
    dsReduzido: ['', [Validators.required, Validators.maxLength(20)]],
    dsDepartamento: ['', [Validators.required, Validators.maxLength(100)]],
    convencaoId: ['', [Validators.required]]
  });

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading.set(true);
    this.departamentoService.cadastrarDepartamento(this.form.value as Departamento).subscribe({
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
