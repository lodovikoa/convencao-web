import { Component, inject, ChangeDetectionStrategy, output, input, ViewChild, ElementRef, signal, computed, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { disabled, form, FormField, maxLength, required, validate } from '@angular/forms/signals';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { catchError, of, switchMap, tap } from 'rxjs';

interface ConvencaoModel {
  dsReduzido: string;
  dsConvencao: string;
  dsEndereco: string;
  dsBairro: string;
  estadoUf: string;
  cidadeId: string;
  dsPais: string;
  dsCep: string;
  dsCnpj: string;
  dsEmail: string;
  dsTelefone1: string;
  dsTelefone2: string;
  dsTelefone3: string;
  dsWatsapp: string;
}

@Component({
  selector: 'app-convencao-dialog-detalhar',
  imports: [FormField],
  // providers: [provideNgxMask()], // Necessário para usar as máscaras do ngx-mask
  templateUrl: './convencao-dialog-detalhar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './convencao-dialog-detalhar.component.scss',
})
export class ConvencaoDialogDetalharComponent {
  private readonly convencaoService = inject(ConvencaoService);
  private readonly estadoService = inject(EstadoService);
  private readonly cidadeService = inject(CidadeService);

  private isPopulatingFromBackend = false;

  @ViewChild('confirmDialogElement') private readonly confirmDialogRef!: ElementRef<HTMLDialogElement>;

  public readonly convencaoId = input<number | null>(null);

  protected readonly atualizado = output<string>();
  protected readonly excluido = output<string>();
  protected readonly fecharDialog = output<void>();

  protected readonly isLoading = signal<boolean>(false);
  protected readonly isLoadingCidades = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected readonly convencaoCompleta = signal<Convencao | null>(null);
  protected readonly estadosList = signal<Estado[]>([]);

  // Observa apenas o estadoUF atual do formModel
  private readonly estadoUfSelecionado$ = toObservable(computed(() => this.formModel().estadoUf));

  // Só busca cidades quando houver UF selecionada; caso contrário, retorna []
  protected readonly cidades = toSignal(
  this.estadoUfSelecionado$.pipe(
    tap(() => {
      if (this.isPopulatingFromBackend) {
        return;
      }

      if (this.isEditing() && this.formModel().cidadeId !== '') {
        this.formModel.update((atual) => ({ ...atual, cidadeId: '' }));
        this.convencaoForm.cidadeId().reset();
      }
    }),
    switchMap((uf) => {
      if (!uf) {
        this.isLoadingCidades.set(false);
        return of([] as Cidade[]);
      }
      this.isLoadingCidades.set(true);
      return this.cidadeService.listarPorUf(uf).pipe(
        catchError(() => of([] as Cidade[])),
        tap(() => this.isLoadingCidades.set(false))
      );
    })
  ),
  { initialValue: [] as Cidade[] }
);

  // Modelo de dados reativo com Signal
  protected readonly formModel = signal<ConvencaoModel>(this.criarModeloVazio());

  // Instância oficial do Signal Form com Schema, validações e controle dinâmico de desativação
  protected readonly convencaoForm = form(this.formModel, (schema) => {
    required(schema.dsReduzido, { message: 'Nome reduzido é obrigatório.' });
    maxLength(schema.dsReduzido, 20, { message: 'Nome reduzido deve ter no máximo 20 caracteres.' });
    disabled(schema.dsReduzido, { when: () => !this.isEditing() });

    required(schema.dsConvencao, { message: 'Nome da convenção é obrigatório.' });
    maxLength(schema.dsConvencao, 100, { message: 'Nome da convenção deve ter no máximo 100 caracteres.' });
    disabled(schema.dsConvencao, { when: () => !this.isEditing() });

    maxLength(schema.dsEndereco, 100, { message: 'Endereço deve ter no máximo 100 caracteres.' });
    disabled(schema.dsEndereco, { when: () => !this.isEditing() });

    maxLength(schema.dsBairro, 100, { message: 'Bairro deve ter no máximo 100 caracteres.' });
    disabled(schema.dsBairro, { when: () => !this.isEditing() });

    required(schema.estadoUf, { message: 'O estado é obrigatório.' })
    disabled(schema.estadoUf, { when: () => !this.isEditing() });

    required(schema.cidadeId, { message: 'A cidade é obrigatória.' });
    disabled(schema.cidadeId, { when: () => !this.isEditing() || !this.formModel().estadoUf || this.isLoadingCidades() });
    validate(schema.cidadeId, ({ value }) => {
      const id = Number(value());
      if (!value() || Number.isNaN(id) || id <= 0) {
        return {
          kind: 'cidadeInvalida',
          message: 'Selecione uma cidade válida.',
        };
      }
      return null;
    });

    maxLength(schema.dsPais, 50, { message: 'Pais deve ter no máximo 50 caracteres.' });
    disabled(schema.dsPais, { when: () => !this.isEditing() });

    maxLength(schema.dsCep, 8, { message: 'CEP deve ter no máximo 8 caracteres.' });
    disabled(schema.dsCep, { when: () => !this.isEditing() });

    maxLength(schema.dsCnpj, 14, { message: 'CNPJ deve ter no máximo 14 caracteres.' });
    disabled(schema.dsCnpj, { when: () => !this.isEditing() });

    maxLength(schema.dsEmail, 100, { message: 'Email deve ter no máximo 100 caracteres.' });
    disabled(schema.dsEmail, { when: () => !this.isEditing() });

    maxLength(schema.dsTelefone1, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    disabled(schema.dsTelefone1, { when: () => !this.isEditing() });

    maxLength(schema.dsTelefone2, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    disabled(schema.dsTelefone2, { when: () => !this.isEditing() });

    maxLength(schema.dsTelefone3, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    disabled(schema.dsTelefone3, { when: () => !this.isEditing() });

    maxLength(schema.dsWatsapp, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    disabled(schema.dsWatsapp, { when: () => !this.isEditing() });
  });

  protected readonly cidadeEstadoFormatado = computed(() => {
  const conv = this.convencaoCompleta();
  if (!conv) {
    return '';
  }

  const cidadeNome = conv.cidade?.dsNomeIbge ?? '';
  const uf =
    conv.cidade?.dsUf ??
    conv.cidade?.estado?.dsUf ??
    conv.estado?.dsUf ??
    '';

  if (cidadeNome && uf) {
    return `${cidadeNome} - ${uf}`;
  }
  return cidadeNome || uf;
});

  public constructor() {
    effect(() => {
      const id = this.convencaoId();
      if (!id) {
        this.resetForm();
        return;
      }

      this.isEditing.set(false);
      this.convencaoCompleta.set(null);
      this.carregarEstadosEData(id);
    });

  effect(() => {
    const convencao = this.convencaoCompleta();
    if (convencao) {
      this.isPopulatingFromBackend = true;
      this.formModel.set(this.mapearConvencaoParaModel(convencao));
      queueMicrotask(() => {
        this.isPopulatingFromBackend = false;
      });
    }
  });
  }

  private criarModeloVazio(): ConvencaoModel {
    return {
      dsReduzido: '',
      dsConvencao: '',
      dsEndereco: '',
      dsBairro: '',
      estadoUf: '',
      cidadeId: '',
      dsPais: '',
      dsCep: '',
      dsCnpj: '',
      dsEmail: '',
      dsTelefone1: '',
      dsTelefone2: '',
      dsTelefone3: '',
      dsWatsapp: '',
    };
  }

  private mapearConvencaoParaModel(convencao: Convencao): ConvencaoModel {
    const cidadeObj = convencao.cidade;
    const estadoUf =
      cidadeObj?.dsUf ??
      cidadeObj?.estado?.dsUf ??
      convencao.estado?.dsUf ??
      (convencao as Convencao & { estadoUf?: string }).estadoUf ??
      '';
    const cidadeIdRaw =
      cidadeObj?.id ??
      (convencao as Convencao & { cidadeId?: number | string }).cidadeId;

    return {
      dsReduzido: convencao.dsReduzido ?? '',
      dsConvencao: convencao.dsConvencao ?? '',
      dsEndereco: convencao.dsEndereco ?? '',
      dsBairro: convencao.dsBairro ?? '',
      estadoUf,
      cidadeId: cidadeIdRaw ? String(cidadeIdRaw) : '',
      dsPais: convencao.dsPais ?? '',
      dsCep: convencao.dsCep ?? '',
      dsCnpj: convencao.dsCnpj ?? '',
      dsEmail: convencao.dsEmail ?? '',
      dsTelefone1: convencao.dsTelefone1 ?? '',
      dsTelefone2: convencao.dsTelefone2 ?? '',
      dsTelefone3: convencao.dsTelefone3 ?? '',
      dsWatsapp: convencao.dsWatsapp ?? '',
    };
  }

  private carregarEstadosEData(id: number): void {
    this.isLoading.set(true);
    this.estadoService.listarTodosEstados().subscribe({
      next: (estados) => {
        const ordenados = [...estados].sort((a, b) => a.dsNome.localeCompare(b.dsNome));
        this.estadosList.set(ordenados);
        this.carregarDados(id);
      },
      error: (err) => {
        console.error('Erro ao carregar estados: ', err);
        this.carregarDados(id);
      },
    });
  }

  private carregarDados(id: number): void {
    // Ajuste o nome do método caso no ConvencaoService seja obterPorId ou semelhante
    this.convencaoService.buscarConvencaoPorId(id).subscribe({
      next: (convencao) => {
        this.convencaoCompleta.set(convencao);
        this.isLoading.set(false);
        console.log('Convencao carregada:', convencao);
      },
      error: (err) => {
        console.error('Erro ao carregar convenção: ', err);
        this.isLoading.set(false);
      },
    });
  }

  protected fechar(): void {
    this.resetForm();
    this.fecharDialog.emit();
  }

  protected ativarEdicao(): void {
    this.isEditing.set(true);
  }

  protected cancelarEdicao(): void {
    const convencao = this.convencaoCompleta();
    if (convencao) {
      this.isPopulatingFromBackend = true;
      this.formModel.set(this.mapearConvencaoParaModel(convencao));
      queueMicrotask(() => {
        this.isPopulatingFromBackend = false;
      });
    }
    this.isEditing.set(false);
  }

  protected salvarAlteracoes(): void {
    if (!this.convencaoForm().valid() || !this.convencaoCompleta()) {
      return;
    }

    this.isLoading.set(true);
    const model = this.formModel();
    const original = this.convencaoCompleta()!;
    const nomeConvencao = model.dsReduzido.trim();

    const convencaoParaAtualizar: any = {
      id: original.id,
      dsReduzido: model.dsReduzido.trim(),
      dsConvencao: model.dsConvencao.trim(),
      dsEndereco: model.dsEndereco.trim(),
      dsBairro: model.dsBairro.trim(),
      cidadeId: Number(model.cidadeId),
      dsPais: model.dsPais.trim(),
      dsCep: model.dsCep.trim(),
      dsCnpj: model.dsCnpj.trim(),
      dsEmail: model.dsEmail.trim(),
      dsTelefone1: model.dsTelefone1.trim(),
      dsTelefone2: model.dsTelefone2.trim(),
      dsTelefone3: model.dsTelefone3.trim(),
      dsWatsapp: model.dsWatsapp.trim(),
    };

    this.convencaoService.editarConvencao(convencaoParaAtualizar).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.atualizado.emit(nomeConvencao);
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao atualizar convenção: ', err);
        this.isLoading.set(false);
      },
    });
  }

  protected abrirModalConfirmarExclusao(): void {
    this.confirmDialogRef?.nativeElement.showModal();
  }

  protected fecharModalConfirmarExclusao(): void {
    this.confirmDialogRef?.nativeElement.close();
  }

  protected confirmarExclusao(): void {
    const id = this.convencaoId();
    const nome = this.convencaoCompleta()?.dsReduzido ?? '';
    if (!id) {
      return;
    }

    this.fecharModalConfirmarExclusao();
    this.isLoading.set(true);

    this.convencaoService.excluirConvencao(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.excluido.emit(nome);
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao excluir convenção: ', err);
        this.isLoading.set(false);
      },
    });
  }

  private resetForm(): void {
    this.formModel.set(this.criarModeloVazio());
    this.isEditing.set(false);
    this.convencaoCompleta.set(null);
    this.convencaoForm().reset();
  }

  protected readonly estadoValido = computed(() => {
    const uf = this.formModel().estadoUf?.trim().toUpperCase();
    if (!uf) {
      return false;
    }

    const listaEstados = this.estadosList();
    if (listaEstados.length > 0) {
      return listaEstados.some((e) => e.dsUf.toUpperCase() === uf);
    }

    return true;
  });

  protected readonly cidadeValida = computed(() => {
    if (!this.estadoValido()) {
      return false;
    }

    const raw = this.formModel().cidadeId?.trim();
    const idNum = raw ? Number(raw) : NaN;
    if (!raw || Number.isNaN(idNum) || idNum <= 0) {
      return false;
    }

    const listaCidades = this.cidades();
    if (listaCidades.length > 0) {
      return listaCidades.some((c) => Number(c.id) === idNum);
    }

    return true;
  });

  protected readonly podeSalvar = computed(() => {
    return (
      this.isEditing() &&
      !this.isLoading() &&
      !this.isLoadingCidades() &&
      this.convencaoForm().valid() &&
      this.estadoValido() &&
      this.cidadeValida()
    );
  });
}
