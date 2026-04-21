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
import { Cargo } from '@shared/interfaces/configuracao/cargo';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { CargoService } from '@shared/services/configuracao/cargo.service';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';

@Component({
  selector: 'app-cargo-dialog-cadastrar',
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
  templateUrl: './cargo-dialog-cadastrar.component.html',
  styleUrl: './cargo-dialog-cadastrar.component.scss',
})
export class CargoDialogCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CargoDialogCadastrarComponent>);
  private readonly cargoService = inject(CargoService);
  private readonly convencaoService = inject(ConvencaoService);

  isLoading = signal(false);

  convencaos = toSignal(this.convencaoService.listarConvencao(), { initialValue: [] as Convencao[] });

  form: FormGroup = this.fb.group({
    dsCargo: ['', [Validators.required, Validators.maxLength(50)]],
    dsTitulo: ['', [Validators.required, Validators.maxLength(5)]],
    convencaoId: ['', [Validators.required]]
  });

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading.set(true);
    this.cargoService.cadastrar(this.form.value as Cargo).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });

  }

}
