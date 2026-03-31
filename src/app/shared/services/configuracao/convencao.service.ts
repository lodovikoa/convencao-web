import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Convencao } from '@shared/interfaces/configuracao/convencao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConvencaoService {

  private readonly API_URL = '/api/convencao';
  private readonly http = inject(HttpClient);

  // Lista todas as convenções disponíveis
  listarConvencao(): Observable<Convencao[]> {
    return this.http.get<Convencao[]>(`${this.API_URL}/listar`);
  }

  // Busca uma convenção específica pelo seu ID único
  buscarConvencaoPorId(id: number): Observable<Convencao> {
    return this.http.get<Convencao>(`${this.API_URL}/id/${id}`);
  }

  // Edita os detalhes de uma convenção existente, identificada por seu ID
  editarConvencao(convencao: any): Observable<Convencao> {
    console.log("Convencao enviada: ", convencao);
    const url = `${this.API_URL}/alterar/${convencao.id}`;
    return this.http.put<Convencao>(url, convencao);
  }

  // Exclui uma convenção do sistema, utilizando seu ID para identificação
  excluirConvencao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/excluir/${id}`);
  }

  // Cadastra uma nova convenção no sistema, utilizando os dados fornecidos
  cadastrarConvencao(convencao: Partial<Convencao>): Observable<Convencao> {
    return this.http.post<Convencao>(`${this.API_URL}/cadastrar`, convencao);
  }


}
