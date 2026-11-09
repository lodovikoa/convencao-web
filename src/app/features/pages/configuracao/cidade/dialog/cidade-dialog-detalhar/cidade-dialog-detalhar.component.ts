import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';

@Component({
  selector: 'app-cidade-dialog-detalhar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cidade-dialog-detalhar.component.html',
  styleUrl: './cidade-dialog-detalhar.component.scss'
})
export class CidadeDialogDetalharComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cidadeService = inject(CidadeService);
  private readonly estadoService = inject(EstadoService);

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogElement');

  readonly atualizado = output<void>();

  protected readonly loading = signal<boolean>(false);
  protected readonly editando = signal<boolean>(false);
  protected readonly cidadeId = signal<number | null>(null);
  protected readonly cidadeCompleta = signal<Cidade | null>(null);
  protected readonly estadosList = signal<Estado[]>([]);

  protected readonly form = this.fb.group({
    dsNomeIbge: ['', [Validators.required, Validators.maxLength(50)]],
    cdIbge: ['', [Validators.required, Validators.maxLength(7)]],
    dsNomeTom: ['', [Validators.maxLength(50)]],
    cdTom: ['', [Validators.maxLength(5)]],
    estadoId: [null as number | null, [Validators.required]]
  });

  public abrir(id: number): void {
    this.cidadeId.set(id);
    this.editando.set(false);
    this.form.disable();
    this.carregarEstados();
    this.carregarDados(id);
    this.dialogRef()?.nativeElement.showModal();
  }

  protected fechar(): void {
    this.dialogRef()?.nativeElement.close();
    this.form.reset();
    this.editando.set(false);
    this.cidadeId.set(null);
    this.cidadeCompleta.set(null);
  }

  protected alternarEdicao(): void {
    if (this.editando()) {
      this.preencherFormularioComDadosOriginais();
      this.form.disable();
      this.editando.set(false);
    } else {
      this.editando.set(true);
      this.form.enable();
    }
  }

  private carregarEstados(): void {
    this.estadoService.listarTodosEstados().subscribe({
      next: (estados) => this.estadosList.set(estados),
      error: (err) => console.error('Erro ao carregar estados:', err)
    });
  }

  private carregarDados(id: number): void {
    this.loading.set(true);
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

    this.form.patchValue({
      dsNomeIbge: cidade.dsNomeIbge ?? '',
      cdIbge: cidade.cdIbge ?? '',
      dsNomeTom: cidade.dsNomeTom ?? '',
      cdTom: cidade.cdTom ?? '',
      estadoId: cidade.estado?.id ?? null
    });
  }

  protected aplicarMascaraApenasNumeros(event: Event, controlName: 'cdIbge' | 'cdTom', maxLength: number): void {
    const input = event.target as HTMLInputElement;
    const valorLimpo = input.value.replace(/\D/g, '').slice(0, maxLength);
    input.value = valorLimpo;
    this.form.get(controlName)?.setValue(valorLimpo, { emitEvent: false });
  }

  protected salvar(): void {
    if (this.form.invalid || !this.cidadeCompleta()) return;

    this.loading.set(true);
    const formValues = this.form.getRawValue();
    const original = this.cidadeCompleta()!;

    const estadoSelecionado = this.estadosList().find(e => e.id === Number(formValues.estadoId));
    const ufDestino = estadoSelecionado ? estadoSelecionado.dsUf : original.estado?.dsUf;

    // Monta o objeto sem enviar o objeto "estado" completo, apenas as propriedades básicas e o estadoUF
    const cidadeParaAtualizar: any = {
      id: original.id,
      cdIbge: formValues.cdIbge ?? original.cdIbge,
      cdTom: formValues.cdTom ?? original.cdTom,
      dsNomeTom: formValues.dsNomeTom ?? original.dsNomeTom,
      dsNomeIbge: formValues.dsNomeIbge ?? original.dsNomeIbge,
      estadoUf: ufDestino
    };

    this.cidadeService.editarCidade(cidadeParaAtualizar).subscribe({
      next: () => {
        this.loading.set(false);
        this.atualizado.emit();
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao atualizar cidade:', err);
        this.loading.set(false);
      }
    });
  }
}
