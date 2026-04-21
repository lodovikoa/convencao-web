import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Cargo } from '@shared/interfaces/configuracao/cargo';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { CargoService } from '@shared/services/configuracao/cargo.service';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';

@Component({
  selector: 'app-cargo-dialog-alterar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinner
  ],
  templateUrl: './cargo-dialog-alterar.component.html',
  styleUrl: './cargo-dialog-alterar.component.scss',
})
export class CargoDialogAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CargoDialogAlterarComponent>);
  private readonly cargoService = inject(CargoService);
  private readonly data: Cargo = inject(MAT_DIALOG_DATA);
  private readonly convencaoService = inject(ConvencaoService);

  isLoading = signal(false);

  form!: FormGroup;

  convencaos = signal<Convencao[]>([]); // Sinal para armazenar as Convencões

  ngOnInit(): void {
    this.carregarConvencaos();

    this.form = this.fb.group({
      id: [this.data.id],
      dsCargo: [this.data.dsCargo, [Validators.required, Validators.maxLength(50)]],
      dsTitulo: [this.data.dsTitulo, [Validators.required, Validators.maxLength(5)]],
      convencao: [this.data.convencao, [Validators.required]]
    });
  }

  private carregarConvencaos(): void {
    this.convencaoService.listarConvencao().subscribe(result => {
      this.convencaos.set(result);
    });
  }

  compararConvencao(convencao1: Convencao | null, convencao2: Convencao | null): boolean {
    if (convencao1 === null && convencao2 === null) return true; // Ambos são nulos, considerados iguais
    if (convencao1 === null || convencao2 === null) return false; // Um é nulo e o outro não, considerados diferentes
    return convencao1.id === convencao2.id; // Compara os IDs das Convencões para determinar se são iguais
  }

  onSave(): void {
    if (this.form.invalid) return;

    const forValue = this.form.value;
    const payload: any = {
      ...forValue,
      convencaoId: forValue.convencao? forValue.convencao.id: null // Envia apenas o ID da Convencão
    };

    delete payload.convencao; // Remove o objeto Convencão do payload, pois o backend espera apenas o ID

    this.cargoService.editar(payload).subscribe({
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
