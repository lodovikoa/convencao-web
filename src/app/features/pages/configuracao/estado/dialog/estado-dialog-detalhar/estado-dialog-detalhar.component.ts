import { Component, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef, input, output, effect, computed } from '@angular/core';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { form, required, minLength, maxLength, FormField, disabled } from '@angular/forms/signals';
import { LoginFacadeService } from '@shared/services/auth/login-facade.service';

@Component({
  selector: 'app-estado-dialog-detalhar',
  imports: [ FormField ],
  templateUrl: './estado-dialog-detalhar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './estado-dialog-detalhar.component.scss',
})
export class EstadoDialogDetalharComponent {
  private readonly estadoService: EstadoService = inject(EstadoService);
  private readonly loginFacade = inject(LoginFacadeService)

  public readonly estado = input.required<Estado>();
  public readonly fecharModal = output<{ acao: 'atualizado' | 'excluido'; nomeEstado: string } | undefined>();

  @ViewChild('confirmDialogRef') public readonly confirmDialogRef!: ElementRef<HTMLDialogElement>;

  protected readonly isLoading = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);

  protected readonly temPermissaoCadastrarExcluir = computed(() => this.loginFacade.hasPermission('T_CFT_MASTER'));

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

  protected ativarEdicao(): void {
    this.isEditing.set(true);
  }

  protected cancelarEdicao(): void {
    this.formModel.set({ ...this.estado() });
    this.isEditing.set(false);
  }

  protected onUfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    this.formModel.update(model => ({ ...model, dsUf: upperValue }));
  }

  protected onNomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formModel.update(model => ({ ...model, dsNome: input.value }));
  }

  protected salvarAlteracoes(): void {
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

  protected fechar(): void {
    this.fecharModal.emit(undefined);
  }
}
