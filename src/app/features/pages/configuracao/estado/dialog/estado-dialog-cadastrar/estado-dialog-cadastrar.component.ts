import { Component, inject, signal, ChangeDetectionStrategy, output } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { EstadoService } from '@shared/services/configuracao/estado.service';

@Component({
  selector: 'app-estado-dialog-cadastrar',
  imports: [ FormField ],
  templateUrl: './estado-dialog-cadastrar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './estado-dialog-cadastrar.component.scss',
})
export class EstadoDialogCadastrarComponent {
  private readonly estadoService: EstadoService = inject(EstadoService);

  public readonly fechar = output<{ salvo: boolean; nomeEstado?: string }>();
  protected readonly isLoading = signal<boolean>(false);

  protected readonly formModel = signal<Omit<Estado, 'id' | 'links'>>({
    dsUf: '',
    dsNome: ''
  });

  protected readonly estadoForm = form(this.formModel, schema => {
    required(schema.dsUf, { message: 'A UF é obrigatória' });
    minLength(schema.dsUf, 2, { message: 'A UF deve ter exatamente 2 caracteres' });
    maxLength(schema.dsUf, 2, { message: 'A UF deve ter exatamente 2 caracteres' });

    required(schema.dsNome, { message: 'O nome do estado é obrigatório' });
    minLength(schema.dsNome, 3, { message: 'O nome deve ter no mínimo 3 caracteres' });
  });

  // Mantido apenas para forçar a caixa alta na UF de forma fluida enquanto digita
  protected onUfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    if (input.value !== upperValue) {
      input.value = upperValue;
    }
    this.estadoForm.dsUf().value.set(upperValue);
  }

  protected onSave(): void {
    if (this.estadoForm().valid()) {
      this.isLoading.set(true);
      const dadosFormulario = this.formModel();
      const nomeEstadoCadastrado = dadosFormulario.dsNome;

      this.estadoService.cadastrarEstado(dadosFormulario as Estado).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.resetForm(); // Limpa os dados e estados do formulário
          this.fechar.emit({ salvo: true, nomeEstado: nomeEstadoCadastrado });
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  protected onCancel(): void {
    this.resetForm(); // Limpa os dados e estados do formulário
    this.fechar.emit({ salvo: false });
  }

  private resetForm(): void {
    // Reseta os valores do model
    this.formModel.set({ dsUf: '', dsNome: '' });
    // Reseta o estado de toque/sujeira e validações do formulário reativo por sinais
    this.estadoForm().reset();
  }
}
