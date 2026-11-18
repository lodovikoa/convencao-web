import { Component, ElementRef, inject, OnInit, output, signal, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';

// Interface exclusiva para o modelo do formulário de cadastro
export interface CidadeCadastroModel {
  dsNomeIbge: string;
  cdIbge: string;
  dsNomeTom: string;
  cdTom: string;
  estadoUf: string;
}

@Component({
  selector: 'app-cidade-dialog-cadastrar',
  standalone: true,
  imports: [FormField],
  templateUrl: './cidade-dialog-cadastrar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cidade-dialog-cadastrar.component.scss'
})
export class CidadeDialogCadastrarComponent implements OnInit {
  private readonly cidadeService = inject(CidadeService);
  private readonly estadoService = inject(EstadoService);

  @ViewChild('modalCadastro') private readonly modalCadastroRef!: ElementRef<HTMLDialogElement>;

  // Output emitindo o nome da cidade cadastrada com sucesso
  protected readonly salvo = output<string>();

  // Lista de estados para o combobox
  protected readonly estados = signal<Estado[]>([]);
  protected readonly isLoading = signal<boolean>(false);

  // Modelo do formulário utilizando Omit da interface Cidade
  protected readonly formModel = signal<CidadeCadastroModel>({
    dsNomeIbge: '',
    cdIbge: '',
    dsNomeTom: '',
    cdTom: '',
    estadoUf: ''
  });

  // Definição do formulário com Signal Forms e validações via schema
  protected readonly cidadeForm = form(this.formModel, schema => {
    required(schema.dsNomeIbge, { message: 'O nome da cidade (IBGE) é obrigatório' });
    maxLength(schema.dsNomeIbge, 50, { message: 'O nome deve ter no máximo 50 caracteres' });

    required(schema.cdIbge, { message: 'O código IBGE é obrigatório' });
    maxLength(schema.cdIbge, 7, { message: 'O código IBGE deve ter no máximo 7 dígitos' });

    maxLength(schema.dsNomeTom, 50, { message: 'O nome TOM deve ter no máximo 50 caracteres' });
    maxLength(schema.cdTom, 5, { message: 'O código TOM deve ter no máximo 5 dígitos' });

    required(schema.estadoUf, { message: 'O estado (UF) é obrigatório' });
  });

  public ngOnInit(): void {
    this.carregarEstados();
  }

  private carregarEstados(): void {
    this.estadoService.listarTodosEstados().subscribe({
      next: (lista) => {
        const estadosOrdenados = lista.sort((a, b) => a.dsNome.localeCompare(b.dsNome));
        this.estados.set(estadosOrdenados);
      },
      error: (err) => {
        console.error('Erro ao carregar estados para o combobox:', err);
      }
    });
  }

  public abrir(): void {
    this.resetForm();
    if (this.modalCadastroRef?.nativeElement) {
      this.modalCadastroRef.nativeElement.showModal();
    }
  }

  public fechar(): void {
    if (this.modalCadastroRef?.nativeElement) {
      this.modalCadastroRef.nativeElement.close();
    }
  }

  protected onSave(): void {
    if (this.cidadeForm().valid()) {
      this.isLoading.set(true);
      const dadosFormulario = this.formModel();
      const nomeCidade = dadosFormulario.dsNomeIbge.trim();

      const payload = {
        ...dadosFormulario,
        cdIbge: dadosFormulario.cdIbge.trim(),
        cdTom: dadosFormulario.cdTom ? dadosFormulario.cdTom.trim() : undefined,
        dsNomeIbge: nomeCidade,
        dsNomeTom: dadosFormulario.dsNomeTom ? dadosFormulario.dsNomeTom.trim() : undefined,
        estadoUf: dadosFormulario.estadoUf.trim()
      };

      this.cidadeService.cadastrarCidade(payload as any).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.resetForm();
          this.salvo.emit(nomeCidade);
          this.fechar();
        },
        error: (err) => {
          console.error('Erro ao cadastrar nova cidade:', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  protected onCancel(): void {
    this.resetForm();
    this.fechar();
  }

  private resetForm(): void {
    this.formModel.set({
      dsNomeIbge: '',
      cdIbge: '',
      dsNomeTom: '',
      cdTom: '',
      estadoUf: ''
    });
    this.cidadeForm().reset();
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
}
