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
import { Regiao } from '@shared/interfaces/configuracao/regiao';
import { compareEntities } from '@shared/interfaces/utilitarios/compare.util';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { RegiaoService } from '@shared/services/configuracao/regiao.service';

@Component({
  selector: 'app-regiao-alterar',
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
  templateUrl: './regiao-alterar.component.html',
  styleUrl: './regiao-alterar.component.scss',
})
export class RegiaoAlterarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly dialogRef = inject(MatDialogRef<RegiaoAlterarComponent>);
  private readonly data: Regiao = inject(MAT_DIALOG_DATA);
  private readonly service = inject(RegiaoService);

  readonly compararConvencao = compareEntities<Convencao>;

  isLoading = signal(false);

  form!: FormGroup;
  convencaos = signal<Convencao[]>([]);

  ngOnInit(): void {
    this.carregarConvencaos();

    this.form = this.fb.group({
      id: [this.data.id],
      dsRegiao: [this.data.dsRegiao, [Validators.required, Validators.maxLength(50)]],
      convencao: [this.data.convencao, [Validators.required]]
    });
  }

  private carregarConvencaos(): void {
    this.convencaoService.listarConvencao().subscribe(result => {
      this.convencaos.set(result);
    });
  }

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
      convencaoId: formValue.convencao ? formValue.convencao.id : null,
    };

    // 3. Removemos o objeto 'convencao' completo para a API receber apenas o Long (ID)
    delete payload.convencao;

    this.service.editar(payload).subscribe({
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
