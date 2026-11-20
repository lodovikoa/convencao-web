import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { Cargo, CargoRequest } from '@shared/interfaces/configuracao/cargo';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { CargoService } from '@shared/services/configuracao/cargo.service';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { CargoDetalharResultado } from '../../cargo-listar/cargo-listar.component';

interface CargoEdicaoModel {
  id: number;
  dsCargo: string;
  dsTitulo: string;
  convencaoId: string;
}

@Component({
  selector: 'app-cargo-dialog-detalhar',
  imports: [FormField],
  templateUrl: './cargo-dialog-detalhar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cargo-dialog-detalhar.component.scss',
})
export class CargoDialogDetalharComponent {
  private readonly cargoService = inject(CargoService);
  private readonly convencaoService = inject(ConvencaoService);

  public readonly cargo = input.required<Cargo>();
  public readonly fecharModal = output<CargoDetalharResultado | undefined>();

  protected readonly modoEdicao = signal<boolean>(false);
  protected readonly confirmandoExclusao = signal<boolean>(false);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly convencaos = toSignal(
    this.convencaoService.listarConvencao(),
    { initialValue: [] as Convencao[] }
  );

  protected readonly formModel = signal<CargoEdicaoModel>({
    id: 0,
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

  constructor() {
    effect(() => {
      const item = this.cargo();
      this.modoEdicao.set(false);
      this.confirmandoExclusao.set(false);
      this.sincronizarFormulario(item);
    });
  }

  protected habilitarEdicao(): void {
    this.confirmandoExclusao.set(false);
    this.sincronizarFormulario(this.cargo());
    this.modoEdicao.set(true);
  }

  protected cancelarEdicao(): void {
    this.sincronizarFormulario(this.cargo());
    this.cargoForm().reset();
    this.modoEdicao.set(false);
  }

  protected solicitarExclusao(): void {
    this.modoEdicao.set(false);
    this.confirmandoExclusao.set(true);
  }

  protected cancelarExclusao(): void {
    this.confirmandoExclusao.set(false);
  }

  protected confirmarExclusao(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    const atual = this.cargo();

    this.cargoService.excluir(atual.id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.confirmandoExclusao.set(false);
        this.fecharModal.emit({
          acao: 'excluido',
          nomeCargo: atual.dsCargo,
        });
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected onSave(): void {
    if (!this.cargoForm().valid() || this.isLoading()) return;

    this.isLoading.set(true);
    const dados = this.formModel();
    const payload: CargoRequest = {
      id: dados.id,
      dsCargo: dados.dsCargo.trim(),
      dsTitulo: dados.dsTitulo.trim(),
      convencaoId: dados.convencaoId? Number(dados.convencaoId): null,
    };

    this.cargoService.editar(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.modoEdicao.set(false);
        this.fecharModal.emit({
          acao: 'atualizado',
          nomeCargo: payload.dsCargo,
        });
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected onFechar(): void {
    this.modoEdicao.set(false);
    this.confirmandoExclusao.set(false);
    this.fecharModal.emit(undefined);
  }

  private sincronizarFormulario(item: Cargo): void {
    this.formModel.set({
      id: item.id,
      dsCargo: item.dsCargo ?? '',
      dsTitulo: item.dsTitulo ?? '',
      convencaoId: item.convencao?.id != null ? String(item.convencao.id): '',
    });
  }
}
