import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '@shared/interfaces/configuracao/estado';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {

  private readonly API_URL = '/api/estado';
  private readonly http = inject(HttpClient);

  listarEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.API_URL + '/listar');
  }

  editarEstado(estado: Estado): Observable<Estado> {
    console.log("Estado enviado: ", estado);
    const url = `${this.API_URL}/alterar/${estado.id}`;
    return this.http.put<Estado>(url, estado);
  }

  excluirEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/excluir/${id}`);
  }

  cadastrarEstado(estado: Partial<Estado>): Observable<Estado> {
    return this.http.post<Estado>(`${this.API_URL}/cadastrar`, estado);
  }
}
