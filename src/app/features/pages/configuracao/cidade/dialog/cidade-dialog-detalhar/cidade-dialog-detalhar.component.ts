import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, maxLength, required } from '@angular/forms/signals';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';

interface CidadeFormModel {
  dsNomeIbge: string;
  cdIbge: string;
  dsNomeTom: string;
  cdTom: string;
  estadoId: number | null;
}

@Component({
  selector: 'app-cidade-dialog-detalhar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cidade-dialog-detalhar.component.html',
  styleUrl: './cidade-dialog-detalhar.component.scss'
})
export class CidadeDialogDetalharComponent {
  private readonly cidadeService = inject(CidadeService);
  private readonly estadoService = inject(EstadoService);

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogElement');
  private readonly confirmDialogRef = viewChild<ElementRef<HTMLDialogElement>>('confirmDialogElement');

  protected readonly atualizado = output<string>();
  protected readonly excluido = output<string>();

  protected readonly loading = signal<boolean>(false);
  protected readonly editando = signal<boolean>(false);
  protected readonly cidadeId = signal<number | null>(null);
  protected readonly cidadeCompleta = signal<Cidade | null>(null);
  protected readonly estadosList = signal<Estado[]>([]);

// 1. Modelo de dados reativo com Signal
  protected readonly formModel = signal<CidadeFormModel>({
    dsNomeIbge: '',
    cdIbge: '',
    dsNomeTom: '',
    cdTom: '',
    estadoId: null
  });

  // 2. Instância oficial do Signal Form com Schema e regras de validação
  protected readonly cidadeForm = form(this.formModel, (schema) => {
    required(schema.dsNomeIbge, { message: 'Nome da cidade (IBGE) é obrigatório' });
    maxLength(schema.dsNomeIbge, 50, { message: 'Máximo de 50 caracteres' });

    required(schema.cdIbge, { message: 'Código IBGE é obrigatório' });
    maxLength(schema.cdIbge, 7, { message: 'Máximo de 7 dígitos' });

    maxLength(schema.dsNomeTom, 50, { message: 'Máximo de 50 caracteres' });
    maxLength(schema.cdTom, 5, { message: 'Máximo de 5 dígitos' });

    required(schema.estadoId, { message: 'Estado (UF) é obrigatório' });
  });

  public abrir(id: number): void {
    this.cidadeId.set(id);
    this.editando.set(false);
    this.dialogRef()?.nativeElement.showModal();

    // Carrega os estados primeiro e, só após tê-los, busca os dados da cidade
    this.carregarEstadosEData(id);
  }

  private carregarEstadosEData(id: number): void {
    this.loading.set(true);

    // Busca os estados
    this.estadoService.listarTodosEstados().subscribe({
      next: (estados) => {
        const ordenados = estados.sort((a, b) => a.dsNome.localeCompare(b.dsNome));
        this.estadosList.set(ordenados);

        // Com os estados garantidos na memória, busca os dados da cidade
        this.carregarDados(id);
      },
      error: (err) => {
        console.error('Erro ao carregar estados:', err);
        this.loading.set(false);
      }
    });
  }

  protected fechar(): void {
    this.dialogRef()?.nativeElement.close();
    this.formModel.set({
      dsNomeIbge: '',
      cdIbge: '',
      dsNomeTom: '',
      cdTom: '',
      estadoId: null
    });
    this.editando.set(false);
    this.cidadeId.set(null);
    this.cidadeCompleta.set(null);
  }

protected alternarEdicao(): void {
    if (this.editando()) {
      this.preencherFormularioComDadosOriginais();
      this.editando.set(false);
    } else {
      this.editando.set(true);
      // Assegura que os dados originais estão sincronizados ao entrar em edição
      this.preencherFormularioComDadosOriginais();
    }
  }

private carregarDados(id: number): void {
    this.cidadeService.buscarCidadePorId(id).subscribe({
      next: (cidade) => {
        this.cidadeCompleta.set(cidade);
        this.preencherFormularioComDadosOriginais();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar dados da cidade:', err);
        this.loading.set(false);
      }
    });
  }

private preencherFormularioComDadosOriginais(): void {
    const cidade = this.cidadeCompleta();
    if (!cidade) return;

    // Atualiza os valores do model mantendo rigorosamente o ID do estado original
    this.formModel.set({
      dsNomeIbge: cidade.dsNomeIbge ?? '',
      cdIbge: cidade.cdIbge ?? '',
      dsNomeTom: cidade.dsNomeTom ?? '',
      cdTom: cidade.cdTom ?? '',
      estadoId: cidade.estado?.id ?? null
    });

    // Garante explicitamente que o nó do signal form receba o ID correto
    if (cidade.estado?.id) {
      this.cidadeForm.estadoId().value.set(cidade.estado.id);
    }
  }

  protected aplicarMascaraNumeros(campo: 'cdIbge' | 'cdTom', maxLengthNum: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorLimpo = input.value.replace(/\D/g, '').slice(0, maxLengthNum);
    input.value = valorLimpo;
    if (campo === 'cdIbge') {
      this.cidadeForm.cdIbge().value.set(valorLimpo);
    } else {
      this.cidadeForm.cdTom().value.set(valorLimpo);
    }
  }

  protected salvar(): void {
    if (!this.cidadeForm().valid() || !this.cidadeCompleta()) return;

    this.loading.set(true);
    const model = this.formModel();
    const original = this.cidadeCompleta()!;

    const estadoSelecionado = this.estadosList().find(e => e.id === Number(model.estadoId));
    const ufDestino = estadoSelecionado ? estadoSelecionado.dsUf : original.estado?.dsUf;
    const nomeCidade = model.dsNomeIbge.trim();

    const cidadeParaAtualizar: any = {
      id: original.id,
      cdIbge: model.cdIbge.trim(),
      cdTom: model.cdTom ? model.cdTom.trim() : undefined,
      dsNomeTom: model.dsNomeTom ? model.dsNomeTom.trim() : undefined,
      dsNomeIbge: nomeCidade,
      estadoUf: ufDestino
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

  protected atualizarEstadoId(valor: string): void {
    const idNumerico = valor ? Number(valor) : null;
    this.cidadeForm.estadoId().value.set(idNumerico);
  }

  // Abre o modal daisyUI de confirmação de exclusão
  protected abrirModalConfirmarExclusao(): void {
    this.confirmDialogRef()?.nativeElement.showModal();
  }

  // Fecha o modal daisyUI de confirmação de exclusão
  protected fecharModalConfirmarExclusao(): void {
    this.confirmDialogRef()?.nativeElement.close();
  }

  // Executa a exclusão da cidade após a confirmação do usuário
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
}
