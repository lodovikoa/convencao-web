import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Escolaridade } from '@shared/interfaces/configuracao/escolaridade';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EscolaridadeService {

  private readonly API_URL = '/api/escolaridades';
  private readonly http = inject(HttpClient);

  // Lista todas as escolaridades disponíveis
  listarEscolaridades():Observable<Escolaridade[]> {
    return this.http.get<Escolaridade[]>(this.API_URL);
  }

  // Busca uma escolaridade por ID
  buscarEscolaridadePorId(id: number):Observable<Escolaridade> {
    return this.http.get<Escolaridade>(`${this.API_URL}/${id}`);
  }

  // Cadastra uma nova escolaridade
  cadastrarEscolaridade(escolaridade: Partial<Escolaridade>): Observable<Escolaridade> {
    return this.http.post<Escolaridade>(this.API_URL, escolaridade);
  }

  // Edita uma escolaridade existente
  editarEscolaridade(escolaridade: any): Observable<Escolaridade> {
    return this.http.put<Escolaridade>(`${this.API_URL}/${escolaridade.id}`, escolaridade);
  }

  // Exclui uma escolaridade por ID
  excluirEscolaridade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

}
