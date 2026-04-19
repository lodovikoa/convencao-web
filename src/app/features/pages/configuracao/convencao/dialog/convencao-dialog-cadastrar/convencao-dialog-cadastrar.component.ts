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
import { Estado } from '@shared/interfaces/configuracao/estado';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-convencao-dialog-cadastrar',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgxMaskDirective,
    MatProgressSpinnerModule
  ],
  providers: [provideNgxMask()], // Necessário para usar as máscaras do ngx-mask
  templateUrl: './convencao-dialog-cadastrar.component.html',
  styleUrl: './convencao-dialog-cadastrar.component.scss',
})
export class ConvencaoDialogCadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ConvencaoDialogCadastrarComponent>);
  private readonly estadoService = inject(EstadoService);
  private readonly convencaoService = inject(ConvencaoService);

  isLoading = signal(false);

  // Carrega os estados da API e transforma em Signal para usar no select
  estados = toSignal(this.estadoService.listarTodosEstados(), { initialValue: [] as Estado[] });

  form: FormGroup = this.fb.group({
    dsReduzido: ['', [Validators.required, Validators.maxLength(20)]],
    dsConvencao: ['', [Validators.required, Validators.maxLength(100)]],
    dsCnpj: [''],
    dsEmail: ['', [Validators.email]],
    dsTelefone1: [''],
    dsTelefone2: [''],
    dsTelefone3: [''],
    dsWatsapp: [''],
    dsCep: [''],
    dsEndereco: [''],
    dsBairro: [''],
    dsCidade: [''],
    dsPais: ['Brasil'],
    estadoId: [null]
  });

  onSave() {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.convencaoService.cadastrarConvencao(this.form.value as Convencao).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isLoading.set(false);
        }
       });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

}
