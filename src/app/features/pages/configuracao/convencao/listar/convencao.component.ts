import { Component, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { ConvencaoDialogDetalharComponent } from '../dialog/convencao-dialog-detalhar/convencao-dialog-detalhar.component';
import { ConvencaoDialogCadastrarComponent } from '../dialog/convencao-dialog-cadastrar/convencao-dialog-cadastrar.component';
import { SuccessModalComponent } from '@shared/utilitarios/success-modal/success-modal.component';
import { LoginFacadeService } from '@shared/services/auth/login-facade.service';
import { ConvencaoResumo } from '@shared/interfaces/configuracao/convencao-resumo';

export interface ConvencaoDetalharResultado {
  acao: 'atualizado' | 'excluido';
  nomeConvencao: string;
}

@Component({
  selector: 'app-convencao',
  standalone: true,
  imports: [ConvencaoDialogCadastrarComponent, ConvencaoDialogDetalharComponent, SuccessModalComponent],
  templateUrl: './convencao.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './convencao.component.scss',
})
export class ConvencaoComponent {
  private readonly convencaoService = inject(ConvencaoService);
  private readonly loginFacade = inject(LoginFacadeService);

  @ViewChild('cadastrarDialog') protected readonly cadastrarDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('detalharDialog') protected readonly detalharDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('successModal') protected readonly successModal!: SuccessModalComponent;

  protected readonly mensagemSucessoModal = signal<string>('');
  protected readonly convencaoSelecionada = signal<ConvencaoResumo | null>(null);

  protected readonly temPermissaoCadastrar = computed(() =>
    this.loginFacade.hasPermission('T_CFT_MASTER')
  );

  protected readonly convencaoResource = rxResource({
    stream:() => this.convencaoService.listarConvencao(),
  });

  protected readonly convencaoList = computed(() => this.convencaoResource.value() ?? []);

  protected readonly isLoading = computed(() => this.convencaoResource.isLoading());

  protected recarregarDados(): void {
    this.convencaoResource.reload();
  }

  protected detalhar(ConvencaoResumo: ConvencaoResumo): void {
    this.convencaoSelecionada.set({ ...ConvencaoResumo });
    this.detalharDialog?.nativeElement.showModal();
  }

  protected fecharDetalharDialog(resultado?: ConvencaoDetalharResultado): void {
    this.detalharDialog?.nativeElement.close();
    this.convencaoSelecionada.set(null);

    if(resultado) {
      if(resultado.acao === 'atualizado') {
        this.mensagemSucessoModal.set(`A convenção "${resultado.nomeConvencao}" foi atualizada com sucesso.`);
      } else if(resultado.acao === 'excluido') {
        this.mensagemSucessoModal.set(`A convenção "${resultado.nomeConvencao}" foi excluída com sucesso.`);
      }
      this.recarregarDados();
      this.successModal?.abrir();
    }
  }

  protected cadastrar(): void {
    this.cadastrarDialog?.nativeElement.showModal();
  }

  protected fecharCadastrarDialog(salvo: boolean, nomeConvencao?: string): void {
    this.cadastrarDialog?.nativeElement.close();

    if(salvo) {
      this.mensagemSucessoModal.set(`A convenção "${nomeConvencao || 'Convencao'}" foi cadastrada com sucesso.`);
      this.recarregarDados();
      this.successModal?.abrir();
    }
  }

  protected fecharModalSucesso(): void {
    this.successModal?.fechar();
    this.mensagemSucessoModal.set('');
  }
}
