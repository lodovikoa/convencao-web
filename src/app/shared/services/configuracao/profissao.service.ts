import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profissao } from '@shared/interfaces/configuracao/profissao';
import { RespostaPaginada } from '@shared/interfaces/utilitarios/resposta-paginada';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfissaoService {

  private readonly API_URL = '/api/profissoes';
  private readonly http = inject(HttpClient);

  listar(page: number = 0, size: number = 10, sort: string = 'dsDescricao,asc', dsDescricao?: string, dsCBO?: string): Observable<RespostaPaginada<Profissao>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

      if(dsDescricao) { params = params.set('dsDescricao', dsDescricao) };
      if(dsCBO) { params = params.set('dsCBO', dsCBO) }

    const url = `${this.API_URL}/listarPage`;
    return this.http.get<RespostaPaginada<Profissao>>(url, { params });
  }

  listarTodos(): Observable<Profissao[]> {
    return this.http.get<Profissao[]>(this.API_URL);
  }

  editar(profissao: Profissao): Observable<Profissao> {
    const url = `${this.API_URL}/${profissao.id}`;
    return this.http.put<Profissao>(url, profissao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  cadastrar(profissao: Partial<Profissao>): Observable<Profissao> {
    return this.http.post<Profissao>(this.API_URL, profissao);
  }

}
