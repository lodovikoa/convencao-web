import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cidade } from '@shared/interfaces/configuracao/cidade';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/cidades';


  // Lista todas as cidades disponíveis
  listarTodasCidades(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(this.API_URL);
  }


  /*
  * Lista todas as cidades disponíveis
  * @Param page Número da página (iniciado com 0)
  * @Param size Número de itens por página
  * @Param nome Nome da cidade
  * @Param ibge Código IBGE da cidade
  * @Param uf Sigla do estado
  */
  listarPaginado(page: number = 0, size: number = 10, nome?: string, ibge?: string, uf?:string): Observable<RespostaPaginada<Cidade>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .append('sort', 'estado.dsUf,asc')
      .append('sort', 'dsNomeIbge,asc');

    if (nome && nome.trim() !== '') {
      params = params.set('dsNomeIbge', nome.trim());
    }

    if (ibge && ibge.trim() !== '') {
      params = params.append('cdIbge', ibge.trim());
    }

    if (uf && uf.trim() !== '') {
      params = params.append('dsUf', uf.trim());
    }

    return this.http.get<RespostaPaginada<Cidade>>(`${this.API_URL}/listarPage`, { params });
  }

  // Edita uma cidade existente
  editarCidade(cidade: Cidade): Observable<Cidade> {
    const url = `${this.API_URL}/${cidade.id}`;
    return this.http.put<Cidade>(url, cidade);
  }

  // Exclui uma cidade pelo ID
  excluirCidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Cadastra uma nova cidade
  cadastrarCidade(cidade: Partial<Cidade>): Observable<Cidade> {
    return this.http.post<Cidade>(this.API_URL, cidade);
  }

}
