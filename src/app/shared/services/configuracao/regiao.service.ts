import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Regiao } from '@shared/interfaces/configuracao/regiao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegiaoService {

  private readonly API_URL = '/api/regiao';
  private readonly http = inject(HttpClient);

  listar(): Observable<Regiao[]> {
    return this.http.get<Regiao[]>(this.API_URL);
  }

  buscarPorId(id: number) {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  cadastrar(entity: Partial<Regiao>): Observable<Regiao> {
    return this.http.post<Regiao>(this.API_URL, entity);
  }

  editar(entity: any): Observable<Regiao> {
    return this.http.put<Regiao>(`${this.API_URL}/${entity.id}`, entity);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
