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
import { MoedaBrDirective } from '@shared/directives/moeda-br.directive';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { PlanoContas } from '@shared/interfaces/configuracao/plano-contas';
import { TipoLancamento } from '@shared/interfaces/configuracao/tipo-lancamento';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { PlanoContasService } from '@shared/services/configuracao/plano-contas.service';
import { TipoLancamentoService } from '@shared/services/configuracao/tipo-lancamento.service';

@Component({
  selector: 'app-tipo-lancamento-cadastrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MoedaBrDirective
  ],
  templateUrl: './tipo-lancamento-cadastrar.component.html',
  styleUrl: './tipo-lancamento-cadastrar.component.scss',
})
export class TipoLancamentoCadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TipoLancamentoCadastrarComponent>);
  private readonly convencaoService = inject(ConvencaoService);
  private readonly planoContasService = inject(PlanoContasService);
  private readonly service = inject(TipoLancamentoService);

  isLoading = signal(false);

  convencaos = toSignal(this.convencaoService.listarConvencao(), { initialValue: [] as Convencao[] });
  planoContas = toSignal(this.planoContasService.listar(), { initialValue: [] as PlanoContas[] });

  form: FormGroup = this.fb.group({
    dsTipoLancamento: ['', [Validators.required, Validators.maxLength(40)]],
    vlTipoLancamento: [null, [Validators.required]],
    planoContasId: [null, [Validators.required]],
    convencaoId: [null, [Validators.required]]
   });

   onSave() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading.set(true);
    this.service.cadastrar(this.form.value as TipoLancamento).subscribe({
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
