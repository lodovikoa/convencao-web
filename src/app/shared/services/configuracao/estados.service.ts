import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estados } from '@shared/interfaces/configuracao/estados';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {

  private readonly API_URL = '/api/estado';
  private readonly http = inject(HttpClient);

  listarEstados(): Observable<Estados[]> {
    return this.http.get<Estados[]>(this.API_URL + '/listar');
  }

  editarEstado(estado: Estados): Observable<Estados> {
    console.log("Estado enviado: ", estado);
    const url = `${this.API_URL}/alterar/${estado.id}`;
    return this.http.put<Estados>(url, estado);
  }

  excluirEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/excluir/${id}`);
  }

  cadastrarEstado(estado: Partial<Estados>): Observable<Estados> {
    return this.http.post<Estados>(`${this.API_URL}/cadastrar`, estado);
  }
}
