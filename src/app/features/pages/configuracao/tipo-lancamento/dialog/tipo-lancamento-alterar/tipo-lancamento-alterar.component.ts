import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MoedaBrDirective } from '@shared/directives/moeda-br.directive';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { PlanoContas } from '@shared/interfaces/configuracao/plano-contas';
import { TipoLancamento } from '@shared/interfaces/configuracao/tipo-lancamento';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { PlanoContasService } from '@shared/services/configuracao/plano-contas.service';
import { TipoLancamentoService } from '@shared/services/configuracao/tipo-lancamento.service';

@Component({
  selector: 'app-tipo-lancamento-alterar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinner,
    MoedaBrDirective
  ],
  templateUrl: './tipo-lancamento-alterar.component.html',
  styleUrl: './tipo-lancamento-alterar.component.scss',
})
export class TipoLancamentoAlterarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly planoContasService = inject(PlanoContasService);
  private readonly dialogRef = inject(MatDialogRef<TipoLancamentoAlterarComponent>);
  private readonly data: TipoLancamento = inject(MAT_DIALOG_DATA);
  private readonly service = inject(TipoLancamentoService);

  isLoading = signal(false);

  form!: FormGroup;
  convencaos = signal<Convencao[]>([]);
  planoContas = signal<PlanoContas[]>([]);

  ngOnInit(): void {
    this.carregarConvencaos();
    this.carregarPlanoContas();

    this.form = this.fb.group({
      id: [this.data.id],
      dsTipoLancamento: [this.data.dsTipoLancamento, [Validators.required, Validators.maxLength(40)]],
      vlTipoLancamento: [this.data.vlTipoLancamento, [Validators.required]],
      planoContas: [this.data.planoContas, [Validators.required]],
      convencao: [this.data.convencao, [Validators.required]]
    });
  }

  private carregarConvencaos(): void {
    this.convencaoService.listarConvencao().subscribe(result => {
      this.convencaos.set(result);
    });
  }

  private carregarPlanoContas(): void {
    this.planoContasService.listar().subscribe(result => {
      this.planoContas.set(result);
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

      // Função para comparar os objetos Plano de Contas no select
  compararPlanoContas(planoContas1: PlanoContas | null, planoContas2: PlanoContas | null): boolean {
    // Se ambos forem nulos, são iguais
    if (planoContas1 === null && planoContas2 === null) return true;

    // Se um for nulo e o outro não, são diferentes
    if (planoContas1 === null || planoContas2 === null) return false;

    // Se ambos existem, compara pelo ID
    return planoContas1.id === planoContas2.id;
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
      convencaoId: formValue.convencao ? formValue.convencao.id : null,
      // Extraímos apenas o ID do objeto PlanoContas selecionado no ComboBox
      planoContasId: formValue.planoContas ? formValue.planoContas.id : null
    };

    // 3. Removemos o objeto 'convencao' completo para a API receber apenas o Long (ID)
    delete payload.convencao;
    delete payload.planoContas;

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
