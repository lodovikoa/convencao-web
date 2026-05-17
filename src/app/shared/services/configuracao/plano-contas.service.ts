import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlanoContas } from '@shared/interfaces/configuracao/plano-contas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanoContasService {
  private readonly API_URL = '/api/planocontas';
  private readonly http = inject(HttpClient);

  listar(): Observable<PlanoContas[]> {
    return this.http.get<PlanoContas[]>(this.API_URL);
  }

  buscarPorId(id: number) {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  cadastrar(planoContas: Partial<PlanoContas>): Observable<PlanoContas> {
    return this.http.post<PlanoContas>(this.API_URL, planoContas);
  }

  editar(entity: any): Observable<PlanoContas> {
    return this.http.put<PlanoContas>(`${this.API_URL}/${entity.id}`, entity);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
