import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { CargoRequest } from '@shared/interfaces/configuracao/cargo';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { CargoService } from '@shared/services/configuracao/cargo.service';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';

interface CargoCadastroModel {
  dsCargo: string;
  dsTitulo: string;
  convencaoId:string;
}

@Component({
  selector: 'app-cargo-dialog-cadastrar',
  imports: [FormField],
  templateUrl: './cargo-dialog-cadastrar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cargo-dialog-cadastrar.component.scss',
})
export class CargoDialogCadastrarComponent {
  private readonly cargoService = inject(CargoService);
  private readonly convencaoService = inject(ConvencaoService);

  public readonly fechar = output<{ salvo: boolean; nomeCargo?: string }>();

  protected readonly isLoading = signal<boolean>(false);
  protected readonly convencaos = toSignal(
    this.convencaoService.listarConvencao(),
    { initialValue: [] as Convencao[] }
  );

  protected readonly formModel = signal<CargoCadastroModel>({
    dsCargo: '',
    dsTitulo: '',
    convencaoId: '',
  });

  protected readonly cargoForm = form(this.formModel, (schema) => {
    required(schema.dsCargo, { message: 'O cargo é obrigatório.' });
    maxLength(schema.dsCargo, 50, {
      message: 'O cargo deve ter no máximo 50 caracteres.',
    });

    required(schema.dsTitulo, { message: 'O título é obrigatório.' });
    maxLength(schema.dsTitulo, 5, {
      message: 'O título deve ter no máximo 5 caracteres.',
    });

    required(schema.convencaoId, { message: 'A convenção é obrigatória.' });
  });

  protected onSave(): void {
    if (!this.cargoForm().valid() || this.isLoading()) return;

    this.isLoading.set(true);
    const dados = this.formModel();
    const payload: CargoRequest = {
      dsCargo: dados.dsCargo.trim(),
      dsTitulo: dados.dsTitulo.trim(),
      convencaoId: dados.convencaoId? Number(dados.convencaoId): null,
    };

    this.cargoService.cadastrar(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        const nomeSalvo = payload.dsCargo;
        this.resetForm();
        this.fechar.emit({ salvo: true, nomeCargo: nomeSalvo });
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.resetForm();
    this.fechar.emit({ salvo: false });
  }

  private resetForm(): void {
    this.formModel.set({
      dsCargo: '',
      dsTitulo: '',
      convencaoId: '',
    });
    this.cargoForm().reset();
  }
}
