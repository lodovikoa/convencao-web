import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { ConvencaoService } from '@shared/services/configuracao/convencao.service';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-convencao-dialog-detalhar',
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    NgxMaskPipe
],
providers: [provideNgxMask()], // Necessário para usar as máscaras do ngx-mask
  templateUrl: './convencao-dialog-detalhar.component.html',
  styleUrl: './convencao-dialog-detalhar.component.scss',
})
export class ConvencaoDialogDetalharComponent {

  // Injeta o serviço para acessar os dados da convenção, se necessário
  private readonly convencaoService = inject(ConvencaoService);

  // Injeta os dados passados pelo componente pai
  readonly data: Convencao = inject(MAT_DIALOG_DATA);

  // Busca a URL do logo usando o serviço e o ID da convenção
  readonly logoUrl = this.convencaoService.obterLogoUrl(this.data.id);

}
