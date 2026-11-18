import { Component, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef, output, effect } from '@angular/core';
import { form, FormField, maxLength, minLength, required, disabled } from '@angular/forms/signals';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';

interface CidadeFormModel {
  dsNomeIbge: string;
  cdIbge: string;
  dsNomeTom: string;
  cdTom: string;
  estadoUf: string;
}

@Component({
  selector: 'app-cidade-dialog-detalhar',
  standalone: true,
  imports: [FormField],
  templateUrl: './cidade-dialog-detalhar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cidade-dialog-detalhar.component.scss'
})
export class CidadeDialogDetalharComponent {
  private readonly cidadeService = inject(CidadeService);
  private readonly estadoService = inject(EstadoService);

  @ViewChild('dialogElement') private readonly dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('confirmDialogElement') private readonly confirmDialogRef!: ElementRef<HTMLDialogElement>;

  protected readonly atualizado = output<string>();
  protected readonly excluido = output<string>();

  protected readonly loading = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected readonly cidadeId = signal<number | null>(null);
  protected readonly cidadeCompleta = signal<Cidade | null>(null);
  protected readonly estadosList = signal<Estado[]>([]);

  // 1. Modelo de dados reativo com Signal
  protected readonly formModel = signal<CidadeFormModel>({
    dsNomeIbge: '',
    cdIbge: '',
    dsNomeTom: '',
    cdTom: '',
    estadoUf: ''
  });

  // 2. Instância oficial do Signal Form com Schema, validações e controle dinâmico de desativação
  protected readonly cidadeForm = form(this.formModel, (schema) => {
    required(schema.dsNomeIbge, { message: 'O nome da cidade (IBGE) é obrigatório' });
    maxLength(schema.dsNomeIbge, 50, { message: 'O nome deve ter no máximo 50 caracteres' });
    disabled(schema.dsNomeIbge, { when: () => !this.isEditing() });

    required(schema.cdIbge, { message: 'O código IBGE é obrigatório' });
    maxLength(schema.cdIbge, 7, { message: 'O código IBGE deve ter no máximo 7 dígitos' });
    disabled(schema.cdIbge, { when: () => !this.isEditing() });

    maxLength(schema.dsNomeTom, 50, { message: 'O nome TOM deve ter no máximo 50 caracteres' });
    disabled(schema.dsNomeTom, { when: () => !this.isEditing() });

    maxLength(schema.cdTom, 5, { message: 'O código TOM deve ter no máximo 5 dígitos' });
    disabled(schema.cdTom, { when: () => !this.isEditing() });

    required(schema.estadoUf, { message: 'O estado (UF) é obrigatório' });
    disabled(schema.estadoUf, { when: () => !this.isEditing() });
  });

  constructor() {
    effect(() => {
      const cidade = this.cidadeCompleta();
      if (cidade) {
        this.formModel.set({
          dsNomeIbge: cidade.dsNomeIbge ?? '',
          cdIbge: cidade.cdIbge ?? '',
          dsNomeTom: cidade.dsNomeTom ?? '',
          cdTom: cidade.cdTom ?? '',
          estadoUf: cidade.estado?.dsUf ?? ''
        });
      }
    });
  }

  public abrir(id: number): void {
    this.cidadeId.set(id);
    this.isEditing.set(false);
    this.dialogRef?.nativeElement.showModal();
    this.carregarEstadosEData(id);
  }

  private carregarEstadosEData(id: number): void {
    this.loading.set(true);

    this.estadoService.listarTodosEstados().subscribe({
      next: (estados) => {
        const ordenados = estados.sort((a, b) => a.dsNome.localeCompare(b.dsNome));
        this.estadosList.set(ordenados);
        this.carregarDados(id);
      },
      error: (err) => {
        console.error('Erro ao carregar estados:', err);
        this.loading.set(false);
      }
    });
  }

  private carregarDados(id: number): void {
    this.cidadeService.buscarCidadePorId(id).subscribe({
      next: (cidade) => {
        this.cidadeCompleta.set(cidade);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar dados da cidade:', err);
        this.loading.set(false);
      }
    });
  }

  protected fechar(): void {
    this.dialogRef?.nativeElement.close();
    this.resetForm();
  }

  protected ativarEdicao(): void {
    this.isEditing.set(true);
  }

  protected cancelarEdicao(): void {
    const cidade = this.cidadeCompleta();
    if (cidade) {
      this.formModel.set({
        dsNomeIbge: cidade.dsNomeIbge ?? '',
        cdIbge: cidade.cdIbge ?? '',
        dsNomeTom: cidade.dsNomeTom ?? '',
        cdTom: cidade.cdTom ?? '',
        estadoUf: cidade.estado?.dsUf ?? ''
      });
    }
    this.isEditing.set(false);
  }

  protected aplicarMascaraNumeros(campo: 'cdIbge' | 'cdTom', maxLengthNum: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorLimpo = input.value.replace(/\D/g, '').slice(0, maxLengthNum);
    input.value = valorLimpo;

    this.formModel.update(model => ({
      ...model,
      [campo]: valorLimpo
    }));
  }

  protected salvarAlteracoes(): void {
    if (!this.cidadeForm().valid() || !this.cidadeCompleta()) return;

    this.loading.set(true);
    const model = this.formModel();
    const original = this.cidadeCompleta()!;
    const nomeCidade = model.dsNomeIbge.trim();

    const cidadeParaAtualizar: any = {
      id: original.id,
      cdIbge: model.cdIbge.trim(),
      cdTom: model.cdTom ? model.cdTom.trim() : undefined,
      dsNomeTom: model.dsNomeTom ? model.dsNomeTom.trim() : undefined,
      dsNomeIbge: nomeCidade,
      estadoUf: model.estadoUf.trim()
    };

    this.cidadeService.editarCidade(cidadeParaAtualizar).subscribe({
      next: () => {
        this.loading.set(false);
        this.atualizado.emit(nomeCidade);
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao atualizar cidade:', err);
        this.loading.set(false);
      }
    });
  }

  protected abrirModalConfirmarExclusao(): void {
    this.confirmDialogRef?.nativeElement.showModal();
  }

  protected fecharModalConfirmarExclusao(): void {
    this.confirmDialogRef?.nativeElement.close();
  }

  protected confirmarExclusao(): void {
    const id = this.cidadeId();
    const nome = this.cidadeCompleta()?.dsNomeIbge ?? '';
    if (!id) return;

    this.fecharModalConfirmarExclusao();
    this.loading.set(true);

    this.cidadeService.excluirCidade(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.excluido.emit(nome);
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao excluir cidade:', err);
        this.loading.set(false);
      }
    });
  }

  private resetForm(): void {
    this.formModel.set({
      dsNomeIbge: '',
      cdIbge: '',
      dsNomeTom: '',
      cdTom: '',
      estadoUf: ''
    });
    this.isEditing.set(false);
    this.cidadeId.set(null);
    this.cidadeCompleta.set(null);
    this.cidadeForm().reset();
  }
}
