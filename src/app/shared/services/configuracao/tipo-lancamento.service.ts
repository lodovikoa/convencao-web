import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoLancamento } from '@shared/interfaces/configuracao/tipo-lancamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoLancamentoService {

  private readonly API_URL = '/api/tiposlancamento';
  private readonly http = inject(HttpClient);

  listar(): Observable<TipoLancamento[]> {
    return this.http.get<TipoLancamento[]>(this.API_URL);
  }

  buscarPorId(id: number) {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  cadastrar(entity: Partial<TipoLancamento>): Observable<TipoLancamento> {
    return this.http.post<TipoLancamento>(this.API_URL, entity);
  }

  editar(entity: any): Observable<TipoLancamento> {
    return this.http.put<TipoLancamento>(`${this.API_URL}/${entity.id}`, entity);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
