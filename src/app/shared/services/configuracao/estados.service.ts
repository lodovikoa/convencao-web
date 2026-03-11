import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estados } from '../../interfaces/configuracao/estados';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {

  private readonly API_URL = '/api/estado';
  private readonly http = inject(HttpClient);

  listarEstados(): Observable<Estados[]> {
    return this.http.get<Estados[]>(this.API_URL + '/listar');
  }

}
