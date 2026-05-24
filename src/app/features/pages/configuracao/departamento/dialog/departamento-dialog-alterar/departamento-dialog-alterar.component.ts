import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { Departamento } from '@shared/interfaces/configuracao/departamento';
import { compareEntities } from '@shared/interfaces/utilitarios/compare.util';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { DepartamentoService } from '@shared/services/configuracao/departamento.service';


@Component({
  selector: 'app-departamento-dialog-alterar',
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
  templateUrl: './departamento-dialog-alterar.component.html',
  styleUrl: './departamento-dialog-alterar.component.scss',
})
export class DepartamentoDialogAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly dialogRef = inject(MatDialogRef<DepartamentoDialogAlterarComponent>);
  private readonly data: Departamento = inject(MAT_DIALOG_DATA);
  private readonly departamentoService = inject(DepartamentoService);

  readonly compararConvencao = compareEntities<Convencao>;

  isLoading = signal(false);

  form!: FormGroup;

  convencaos = signal<Convencao[]>([]); // Sinal para armazenar as Convencões

  ngOnInit(): void {
    this.carregarConvencaos();

    this.form = this.fb.group({
      id: [this.data.id],
      dsReduzido: [this.data.dsReduzido, [Validators.required, Validators.maxLength(20)]],
      dsDepartamento: [this.data.dsDepartamento, [Validators.required, Validators.maxLength(100)]],
      convencao: [this.data.convencao] // Mantém o objeto estado original
    });
  }

  private carregarConvencaos(): void {
    this.convencaoService.listarConvencao().subscribe(result => {
      this.convencaos.set(result);
    });
  }

  // Na interface Departamento, o campo 'convencao' é do tipo Convencao, mas a API espera um campo 'convencaoId' do tipo Long (ID da convencao).
  // Portanto, precisamos criar um objeto de envio (Payload) que contenha o campo 'convencaoId' em vez do objeto 'convencao' completo.
  onSave(): void {
    if (!this.form.valid) {
      return
    }

    this.isLoading.set(true);

    // 1. Pegamos todos os valores do formulário
    const formValue = this.form.value;

    // 2. Criamos o objeto de envio (Payload)
    // Usamos 'any' aqui para permitir a criação do campo 'convencaoId'
    // que não existe na interface Convencao original
    const payload: any = {
      ...formValue,
      // Extraímos apenas o ID do objeto Convencao selecionado no ComboBox
      convencaoId: formValue.convencao ? formValue.convencao.id : null
    };

    // 3. Removemos o objeto 'convencao' completo para a API receber apenas o Long (ID)
    delete payload.convencao;

    this.departamentoService.editarDepartamento(payload).subscribe({
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
