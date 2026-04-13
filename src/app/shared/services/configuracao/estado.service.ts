import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '@shared/interfaces/configuracao/estado';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {

  private readonly API_URL = '/api/estados';
  private readonly http = inject(HttpClient);

  listarEstados(page: number = 0, size: number = 10, sort: string = 'dsNome,asc'): Observable<RespostaPaginada<Estado>> {
    const url = `${this.API_URL}/listarPage?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<RespostaPaginada<Estado>>(url);
  }

  // Lista todos os estados disponíveis
  listarTodosEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.API_URL);
  }

  editarEstado(estado: Estado): Observable<Estado> {
    //console.log("Estado enviado: ", estado);
    const url = `${this.API_URL}/${estado.id}`;
    return this.http.put<Estado>(url, estado);
  }

  excluirEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  cadastrarEstado(estado: Partial<Estado>): Observable<Estado> {
    return this.http.post<Estado>(this.API_URL, estado);
  }
}
