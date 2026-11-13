import { Component, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef, input, output, effect } from '@angular/core';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { form, required, minLength, maxLength, FormField, disabled } from '@angular/forms/signals';

@Component({
  selector: 'app-estado-dialog-detalhar',
  imports: [ FormField ],
  templateUrl: './estado-dialog-detalhar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './estado-dialog-detalhar.component.scss',
})
export class EstadoDialogDetalharComponent {
  private readonly estadoService: EstadoService = inject(EstadoService);

  public readonly estado = input.required<Estado>();
  public readonly fecharModal = output<{ acao: 'atualizado' | 'excluido'; nomeEstado: string } | undefined>();

  @ViewChild('confirmDialogRef') public readonly confirmDialogRef!: ElementRef<HTMLDialogElement>;

  public readonly isLoading = signal<boolean>(false);
  public readonly isEditing = signal<boolean>(false);

  protected readonly formModel = signal<Estado>({
    id: 0,
    dsUf: '',
    dsNome: '',
    links: []
  });

  protected readonly estadoForm = form(this.formModel, schema => {
    required(schema.dsUf, { message: 'A UF é obrigatória' });
    minLength(schema.dsUf, 2, { message: 'Informe os 2 caracteres da UF' });
    maxLength(schema.dsUf, 2, { message: 'Informe os 2 caracteres da UF' });
    disabled(schema.dsUf, { when: () => !this.isEditing() });

    required(schema.dsNome, { message: 'O nome é obrigatório' });
    minLength(schema.dsNome, 3, { message: 'O nome deve ter no mínimo 3 caracteres' });
    disabled(schema.dsNome, { when: () => !this.isEditing() });

  });

  constructor() {
    effect(() => {
      const data = this.estado();
      if (data) {
        this.formModel.set({ ...data });
        this.isEditing.set(false);
      }
    });
  }

  public ativarEdicao(): void {
    this.isEditing.set(true);
  }

  public cancelarEdicao(): void {
    this.formModel.set({ ...this.estado() });
    this.isEditing.set(false);
  }

  public onUfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    this.formModel.update(model => ({ ...model, dsUf: upperValue }));
  }

  public onNomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formModel.update(model => ({ ...model, dsNome: input.value }));
  }

  public salvarAlteracoes(): void {
    if (this.estadoForm().valid()) {
      this.isLoading.set(true);
      const nomeAtualizado = this.formModel().dsNome;

      this.estadoService.editarEstado(this.formModel()).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.fecharModal.emit({ acao: 'atualizado', nomeEstado: nomeAtualizado });
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  protected abrirModalConfirmarExclusao(): void {
    if (this.confirmDialogRef) {
      this.confirmDialogRef.nativeElement.showModal();
    }
  }

  protected fecharModalConfirmarExclusao(): void {
    if (this.confirmDialogRef) {
      this.confirmDialogRef.nativeElement.close();
    }
  }

  protected confirmarExclusao(): void {
    this.fecharModalConfirmarExclusao();
    this.isLoading.set(true);
    const nomeExcluido = this.formModel().dsNome;

    this.estadoService.excluirEstado(this.formModel().id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.fecharModal.emit({ acao: 'excluido', nomeEstado: nomeExcluido });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  public fechar(): void {
    this.fecharModal.emit(undefined);
  }
}
