import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { CidadeService } from '@shared/services/configuracao/cidade.service';
import { EstadoService } from '@shared/services/configuracao/estado.service';

@Component({
  selector: 'app-cidade-dialog-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cidade-dialog-cadastrar.component.html',
  styleUrl: './cidade-dialog-cadastrar.component.scss'
})
export class CidadeDialogCadastrarComponent implements OnInit {
  private readonly cidadeService = inject(CidadeService);
  private readonly estadoService = inject(EstadoService);

  @ViewChild('modalCadastro') private readonly modalCadastroRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('errorDialog') private readonly errorDialogRef!: ElementRef<HTMLDialogElement>;

  // Output modificado para emitir o nome da cidade cadastrada
  protected readonly salvo = output<string>();

  // Estados reativos do formulário
  protected readonly cdIbge = signal<string>('');
  protected readonly cdTom = signal<string>('');
  protected readonly dsNomeIbge = signal<string>('');
  protected readonly dsNomeTom = signal<string>('');
  protected readonly estadoUf = signal<string>('');

  // Lista de estados para o combobox
  protected readonly estados = signal<Estado[]>([]);

  protected readonly salvando = signal<boolean>(false);
  protected readonly errorMessageModal = signal<string | null>(null);

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
    this.limparFormulario();
    if (this.modalCadastroRef?.nativeElement) {
      this.modalCadastroRef.nativeElement.showModal();
    }
  }

  public fechar(): void {
    if (this.modalCadastroRef?.nativeElement) {
      this.modalCadastroRef.nativeElement.close();
    }
  }

  protected abrirModalErro(mensagem: string): void {
    this.errorMessageModal.set(mensagem);
    if (this.errorDialogRef?.nativeElement) {
      this.errorDialogRef.nativeElement.showModal();
    }
  }

  protected fecharModalErro(): void {
    if (this.errorDialogRef?.nativeElement) {
      this.errorDialogRef.nativeElement.close();
    }
    this.errorMessageModal.set(null);
    // O modal de cadastro principal permanece aberto intacto aqui.
  }

  // Tratadores com restrições solicitadas
  protected atualizarIbge(valor: string): void {
    const apenasNumeros = valor.replace(/\D/g, '').slice(0, 7);
    this.cdIbge.set(apenasNumeros);
  }

  protected atualizarTom(valor: string): void {
    const apenasNumeros = valor.replace(/\D/g, '').slice(0, 5);
    this.cdTom.set(apenasNumeros);
  }


  protected atualizarNomeIbge(valor: string): void {
    this.dsNomeIbge.set(valor.slice(0, 50));
  }

  protected atualizarNomeTom(valor: string): void {
    this.dsNomeTom.set(valor.slice(0, 50));
  }

  protected salvar(event: Event): void {
    event.preventDefault();

    if (!this.dsNomeIbge().trim() || !this.cdIbge().trim() || !this.estadoUf().trim()) {
      this.abrirModalErro('Preencha os campos obrigatórios (Cidade, Código IBGE e UF).');
      return;
    }

    const nomeCidade = this.dsNomeIbge().trim();

    const payload: any = {
      cdIbge: this.cdIbge().trim(),
      cdTom: this.cdTom().trim() || undefined,
      dsNomeIbge: nomeCidade,
      dsNomeTom: this.dsNomeTom().trim() || undefined,
      estadoUf: this.estadoUf().trim()
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

  private limparFormulario(): void {
    this.cdIbge.set('');
    this.cdTom.set('');
    this.dsNomeIbge.set('');
    this.dsNomeTom.set('');
    this.estadoUf.set('');
    this.errorMessageModal.set(null);
  }
}
