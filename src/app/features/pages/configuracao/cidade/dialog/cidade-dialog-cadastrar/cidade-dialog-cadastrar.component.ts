import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';

@Component({
  selector: 'app-cidade-dialog-cadastrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cidade-dialog-cadastrar.component.html',
  styleUrl: './cidade-dialog-cadastrar.component.scss'
})
export class CidadeDialogCadastrarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cidadeService = inject(CidadeService);
  private readonly estadoService = inject(EstadoService);

  @ViewChild('modalCadastro') private readonly modalCadastroRef!: ElementRef<HTMLDialogElement>;
  // @ViewChild('errorDialog') private readonly errorDialogRef!: ElementRef<HTMLDialogElement>;

  // Output emitindo o nome da cidade cadastrada com sucesso
  protected readonly salvo = output<string>();

  // Lista de estados para o combobox
  protected readonly estados = signal<Estado[]>([]);

  protected readonly salvando = signal<boolean>(false);
  protected readonly errorMessageModal = signal<string | null>(null);

  // Definição do Formulário Reativo limpo e centralizado
  protected readonly form = this.fb.group({
    dsNomeIbge: ['', [Validators.required, Validators.maxLength(50)]],
    cdIbge: ['', [Validators.required, Validators.maxLength(7)]],
    dsNomeTom: ['', [Validators.maxLength(50)]],
    cdTom: ['', [Validators.maxLength(5)]],
    estadoUf: ['', [Validators.required]]
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
    this.form.reset({
      dsNomeIbge: '',
      cdIbge: '',
      dsNomeTom: '',
      cdTom: '',
      estadoUf: ''
    });
    this.errorMessageModal.set(null);

    if (this.modalCadastroRef?.nativeElement) {
      this.modalCadastroRef.nativeElement.showModal();
    }
  }

  public fechar(): void {
    if (this.modalCadastroRef?.nativeElement) {
      this.modalCadastroRef.nativeElement.close();
    }
  }

  // Máscaras aplicadas de forma limpa diretamente atualizando os controles do Reactive Forms
  protected aplicarMascaraNumeros(controlName: 'cdIbge' | 'cdTom', maxLength: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorLimpo = input.value.replace(/\D/g, '').slice(0, maxLength);
    input.value = valorLimpo;
    this.form.get(controlName)?.setValue(valorLimpo, { emitEvent: false });
  }

  protected aplicarMascaraTexto(controlName: 'dsNomeIbge' | 'dsNomeTom', maxLength: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorLimitado = input.value.slice(0, maxLength);
    input.value = valorLimitado;
    this.form.get(controlName)?.setValue(valorLimitado, { emitEvent: false });
  }

  protected salvar(event: Event): void {
    event.preventDefault();

    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();

    const nomeCidade = formValues.dsNomeIbge!.trim();

    const payload: any = {
      cdIbge: formValues.cdIbge!.trim(),
      cdTom: formValues.cdTom ? formValues.cdTom.trim() : undefined,
      dsNomeIbge: nomeCidade,
      dsNomeTom: formValues.dsNomeTom ? formValues.dsNomeTom.trim() : undefined,
      estadoUf: formValues.estadoUf!.trim()
    };

    this.salvando.set(true);
    this.cidadeService.cadastrarCidade(payload).subscribe({
      next: () => {
        this.salvando.set(false);
        this.salvo.emit(nomeCidade);
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao cadastrar nova cidade:', err);
        this.salvando.set(false);
      }
    });
  }
}
