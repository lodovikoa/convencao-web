import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-convencao-dialog-alterar',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()], // Necessário para usar as máscaras do ngx-mask
  templateUrl: './convencao-dialog-alterar.component.html',
  styleUrl: './convencao-dialog-alterar.component.scss',
})
export class ConvencaoDialogAlterarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly estadoService = inject(EstadoService);
  private readonly dialogRef = inject(MatDialogRef<ConvencaoDialogAlterarComponent>);
  readonly data: Convencao = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

  estados = signal<Estado[]>([]); // Sinal para armazenar os estados

  ngOnInit(): void {
    this.carregarEstados();

    this.form = this.fb.group({
      id: [this.data.id],
      dsReduzido: [this.data.dsReduzido, [Validators.required]],
      dsConvencao: [this.data.dsConvencao, [Validators.required]],
      dsCnpj: [this.data.dsCnpj],
      dsEmail: [this.data.dsEmail, [Validators.email]],
      dsTelefone1: [this.data.dsTelefone1],
      dsTelefone2: [this.data.dsTelefone2],
      dsTelefone3: [this.data.dsTelefone3],
      dsWatsapp: [this.data.dsWatsapp],
      dsCep: [this.data.dsCep],
      dsEndereco: [this.data.dsEndereco],
      dsBairro: [this.data.dsBairro],
      dsCidade: [this.data.dsCidade],
      dsPais: [this.data.dsPais],
      imLogo: [this.data.imLogo],
      estado: [this.data.estado] // Mantém o objeto estado original
    });
  }

  private carregarEstados(): void {
    this.estadoService.listarTodosEstados().subscribe(result => {
      this.estados.set(result);
    });
  }

  // Função para comparar os objetos Estado no select
  compararEstados(estado1: Estado | null, estado2: Estado | null): boolean {
    // Se ambos forem nulos, são iguais
    if (estado1 === null && estado2 === null) return true;

    // Se um for nulo e o outro não, são diferentes
    if (estado1 === null || estado2 === null) return false;

    // Se ambos existem, compara pelo ID
    return estado1.id === estado2.id;
  }


  // Na interface Convencao, o campo 'estado' é do tipo Estado, mas a API espera um campo 'estadoId' do tipo Long (ID do estado).
  // Portanto, precisamos criar um objeto de envio (Payload) que contenha o campo 'estadoId' em vez do objeto 'estado' completo.
  salvar(): void {
    if (this.form.valid) {
      // 1. Pegamos todos os valores do formulário
      const formValue = this.form.value;

      // 2. Criamos o objeto de envio (Payload)
      // Usamos 'any' aqui para permitir a criação do campo 'estadoId'
      // que não existe na interface Convencao original
      const payload: any = {
        ...formValue,
        // Extraímos apenas o ID do objeto Estado selecionado no ComboBox
        estadoId: formValue.estado ? formValue.estado.id : null
      };

      // 3. Removemos o objeto 'estado' completo para a API receber apenas o Long (ID)
      delete payload.estado;

      // 4. Fechamos o diálogo passando o objeto formatado para o componente pai
      this.dialogRef.close(payload);
    }
  }

}
