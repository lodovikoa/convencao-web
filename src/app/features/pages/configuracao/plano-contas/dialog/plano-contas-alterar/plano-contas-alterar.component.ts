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
import { PlanoContas } from '@shared/interfaces/configuracao/plano-contas';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { PlanoContasService } from '@shared/services/configuracao/plano-contas.service';

@Component({
  selector: 'app-plano-contas-alterar',
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
  templateUrl: './plano-contas-alterar.component.html',
  styleUrl: './plano-contas-alterar.component.scss',
})
export class PlanoContasAlterarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly dialogRef = inject(MatDialogRef<PlanoContasAlterarComponent>);
  private readonly data: PlanoContas = inject(MAT_DIALOG_DATA);
  private readonly service = inject(PlanoContasService);

  isLoading = signal(false);

  form!: FormGroup;
  convencaos = signal<Convencao[]>([]); // Sinal para armazenar as Convencões

  ngOnInit(): void {
    this.carregarConvencaos();

    this.form = this.fb.group({
      id: [this.data.id],
      cdConta: [this.data.cdConta, [Validators.required, Validators.pattern(/^\d*$/)]],
      dsConta: [this.data.dsConta, [Validators.required, Validators.maxLength(100)]],
      tpConta: [this.data.tpConta, [Validators.required, Validators.maxLength(1), Validators.pattern(/^[DC]$/)]],
      convencao: [this.data.convencao] // Mantém o objeto estado original
    });
  }

  private carregarConvencaos(): void {
    this.convencaoService.listarConvencao().subscribe(result => {
      this.convencaos.set(result);
    });
  }

  // Função para comparar os objetos Convencao no select
  compararConvencao(convencao1: Convencao | null, convencao2: Convencao | null): boolean {
    // Se ambos forem nulos, são iguais
    if (convencao1 === null && convencao2 === null) return true;

    // Se um for nulo e o outro não, são diferentes
    if (convencao1 === null || convencao2 === null) return false;

    // Se ambos existem, compara pelo ID
    return convencao1.id === convencao2.id;
  }

  onSave(): void {
    if (!this.form.valid) {
      return
    }
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
