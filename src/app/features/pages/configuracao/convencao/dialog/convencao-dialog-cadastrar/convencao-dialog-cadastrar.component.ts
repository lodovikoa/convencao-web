import { Component, inject, ChangeDetectionStrategy, output, signal, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormField, maxLength, required, form, validate, disabled} from '@angular/forms/signals';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { ConvencaoRequest } from '@shared/interfaces/configuracao/convencao';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';
import { catchError, of, switchMap, tap } from 'rxjs';

interface ConvencaoCadastroModel {
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
  selector: 'app-convencao-dialog-cadastrar',
  // imports: [ FormField, NgxMaskDirective ],
  imports: [ FormField ],
  // providers: [provideNgxMask()], // Necessário para usar as máscaras do ngx-mask
  templateUrl: './convencao-dialog-cadastrar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './convencao-dialog-cadastrar.component.scss',
})
export class ConvencaoDialogCadastrarComponent {

  private readonly convencaoService = inject(ConvencaoService);
  private readonly estadoService = inject(EstadoService);
  private readonly cidadeService = inject(CidadeService);

  public readonly fechar = output<{ salvo: boolean; nomeConvencao?: string }>();

  protected readonly isLoading = signal<boolean>(false);
  protected readonly isLoadingCidades = signal<boolean>(false);
  protected readonly estados = toSignal( this.estadoService.listarTodosEstados(), { initialValue: [] as Estado[] });

  // Observa apenas o estadoUF atual do formModel
  private readonly estadoUfSelecionado$ = toObservable( computed(() => this.formModel().estadoUf) );

  // Só busca cidades quando houver UF selecionada; caso contrário, rtorna []
  protected readonly cidades = toSignal(
    this.estadoUfSelecionado$.pipe(
      tap(() => {
        // Limpa a cidade selecionada sempre que o estado mudar
        if(this.formModel().cidadeId !== '') {
          this.formModel.update((atual) => ({ ...atual, cidadeId: '' }));
        }
      }),
      switchMap((uf) => {
        if(!uf) {
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

  protected readonly formModel = signal<ConvencaoCadastroModel>({
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
    dsWatsapp: ''
  })

  protected readonly convencaoForm = form(this.formModel, (schema) => {
    required(schema.dsReduzido, { message: 'Nome reduzido é obrigatório.' });
    maxLength(schema.dsReduzido, 20, { message: 'Nome reduzido deve ter no máximo 20 caracteres.' });

    required(schema.dsConvencao, { message: 'Nome da convenção é obrigatório.' });
    maxLength(schema.dsConvencao, 100, { message: 'Nome da convenção deve ter no máximo 100 caracteres.' });

    maxLength(schema.dsEndereco, 100, { message: 'Endereço deve ter no máximo 100 caracteres.' });
    maxLength(schema.dsBairro, 100, { message: 'Bairro deve ter no máximo 100 caracteres.' });

    required(schema.cidadeId, { message: 'A cidadde é obrigatória.' });
    disabled(schema.cidadeId, { when: () => !this.formModel().estadoUf || this.isLoadingCidades() });
    validate(schema.cidadeId, ({ value })=>{
      const id = Number(value());
      if(!value() || Number.isNaN(id) || id <= 0) {
        return {
          kind: 'cidadeInvalida',
          message: 'Selecione uma cidade válida.',
        };
      }
      return null;
    });

    maxLength(schema.dsPais, 50, { message: 'Pais deve ter no máximo 50 caracteres.' });
    maxLength(schema.dsCep, 8, { message: 'CEP deve ter no máximo 8 caracteres.' });
    maxLength(schema.dsCnpj, 14, { message: 'CNPJ deve ter no máximo 14 caracteres.' });
    maxLength(schema.dsEmail, 100, { message: 'Email deve ter no máximo 100 caracteres.' });
    maxLength(schema.dsTelefone1, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    maxLength(schema.dsTelefone2, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    maxLength(schema.dsTelefone3, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
    maxLength(schema.dsWatsapp, 15, { message: 'Telefone deve ter no máximo 15 caracteres.' });
  });

  protected onSave(): void {
    if(!this.convencaoForm().valid() || this.isLoading() ) return;

    this.isLoading.set(true);
    const dados = this.formModel();
    const cidadeIdNumero = Number(dados.cidadeId)
    const payload: ConvencaoRequest = {
      dsReduzido: dados.dsReduzido.trim(),
      dsConvencao: dados.dsConvencao.trim(),
      dsEndereco: dados.dsEndereco.trim(),
      dsBairro: dados.dsBairro.trim(),
      cidadeId: cidadeIdNumero > 0? cidadeIdNumero: null,
      dsPais: dados.dsPais.trim(),
      dsCep: dados.dsCep,
      dsCnpj: dados.dsCnpj,
      dsEmail: dados.dsEmail.trim(),
      dsTelefone1: dados.dsTelefone1.trim(),
      dsTelefone2: dados.dsTelefone2.trim(),
      dsTelefone3: dados.dsTelefone3.trim(),
      dsWatsapp: dados.dsWatsapp.trim()
    };

    this.convencaoService.cadastrarConvencao(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        const nomeSalvo = payload.dsReduzido;
        this.resetForm();
        this.fechar.emit({ salvo:true, nomeConvencao: nomeSalvo });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  protected onCancel(): void {
    this.resetForm();
    this.fechar.emit({ salvo: false });
  }

  private resetForm(): void {
    this.formModel.set({
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
      dsWatsapp: ''
    });
    this.convencaoForm().reset();
  }
}
