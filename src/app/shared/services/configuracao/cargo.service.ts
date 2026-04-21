import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cargo } from '@shared/interfaces/configuracao/cargo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargoService {

  private readonly API_URL = '/api/cargos';
  private readonly http = inject(HttpClient);

  listar(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.API_URL}/${id}`);
  }

  cadastrar(cargo: Partial<Cargo>): Observable<Cargo> {
    return this.http.post<Cargo>(this.API_URL, cargo);
  }

  editar(cargo: Cargo): Observable<Cargo> {
    return this.http.put<Cargo>(`${this.API_URL}/${cargo.id}`, cargo);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

}
