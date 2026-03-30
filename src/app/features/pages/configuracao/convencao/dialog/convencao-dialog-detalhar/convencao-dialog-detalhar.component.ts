import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Convencao } from '@shared/interfaces/configuracao/convencao';

@Component({
  selector: 'app-convencao-dialog-detalhar',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './convencao-dialog-detalhar.component.html',
  styleUrl: './convencao-dialog-detalhar.component.scss',
})
export class ConvencaoDialogDetalharComponent {

  // Injeta os dados passados pelo componente pai
  readonly data: Convencao = inject(MAT_DIALOG_DATA);

}
