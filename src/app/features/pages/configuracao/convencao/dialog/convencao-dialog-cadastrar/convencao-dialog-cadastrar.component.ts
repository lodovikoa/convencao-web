import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Estado } from '@shared/interfaces/configuracao/estado';
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
    NgxMaskDirective
  ],
  providers: [provideNgxMask()], // Necessário para usar as máscaras do ngx-mask
  templateUrl: './convencao-dialog-cadastrar.component.html',
  styleUrl: './convencao-dialog-cadastrar.component.scss',
})
export class ConvencaoDialogCadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ConvencaoDialogCadastrarComponent>);
  private readonly estadoService = inject(EstadoService);

  // Carrega os estados da API e transforma em Signal para usar no select
  estados = toSignal(this.estadoService.listarTodosEstados(), { initialValue: [] as Estado[] });

  form: FormGroup = this.fb.group({
    dsReduzido: ['', [Validators.required, Validators.maxLength(50)]],
    dsConvencao: ['', [Validators.required]],
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
    imLogo: [null],
    estadoId: [null]
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
