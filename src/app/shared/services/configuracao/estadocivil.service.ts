import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Estadocivil } from '@shared/interfaces/configuracao/estadocivil';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadocivilService {

  private readonly API_URL = '/api/estadocivil';
  private readonly http = inject(HttpClient);

  listar():Observable<Estadocivil[]> {
     return this.http.get<Estadocivil[]>(this.API_URL);
  }

  buscarPorId(id: number):Observable<Estadocivil> {
    return this.http.get<Estadocivil>(`${this.API_URL}/${id}`);
  }

  cadastrar(estadocivil: Partial<Estadocivil>): Observable<Estadocivil> {
    return this.http.post<Estadocivil>(this.API_URL, estadocivil);
  }

  editar(estadocivil: any): Observable<Estadocivil> {
    return this.http.put<Estadocivil>(`${this.API_URL}/${estadocivil.id}`, estadocivil);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

}
