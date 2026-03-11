import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstadosService } from '../../../../../shared/services/configuracao/estados.service';
import { Estados } from '../../../../../shared/interfaces/configuracao/estados';

@Component({
  selector: 'app-estados',
  imports: [],
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.scss',
})
export class EstadosComponent {

  private estadosService = inject(EstadosService);

  estados = toSignal(this.estadosService.listarEstados(),
    {
      initialValue:[] as Estados[]
    });

}
