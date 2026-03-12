import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstadosService } from '../../../../../shared/services/configuracao/estados.service';
import { Estados } from '../../../../../shared/interfaces/configuracao/estados';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estados',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.scss',
})
export class EstadosComponent {

  private readonly estadosService = inject(EstadosService);
  displayedColumns: string[] = ['uf', 'nome', 'acoes'];

  estados = toSignal(this.estadosService.listarEstados(),
    {
      initialValue:[] as Estados[]
    });


    editar(estado: Estados) {
    console.log(`Editando estado ID: ${estado.id} - ${estado.nome}`);
    // Aqui você chamaria o seu serviço ou abriria um modal
  }

  excluir(estado: Estados) {
    console.log(`Solicitação para excluir ID: ${estado.id}`);
    // Lógica para remover da lista ou confirmar exclusão
  }

}
