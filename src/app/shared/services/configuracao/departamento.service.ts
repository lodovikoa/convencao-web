import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Departamento } from '@shared/interfaces/configuracao/departamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {

  private readonly API_URL = '/api/departamentos';
  private readonly http = inject(HttpClient);

  // Lista todos os departamentos disponíveis
  listarDepartamentos():Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.API_URL);
  }

  // Busca um departamento por ID
  buscarDepartamentoPorId(id: number) {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // Cadastra um novo departamento
  cadastrarDepartamento(departamento: Partial<Departamento>): Observable<Departamento> {
    return this.http.post<Departamento>(this.API_URL, departamento);
  }

  // Edita um departamento existente
  editarDepartamento(departamento: any): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.API_URL}/${departamento.id}`, departamento);
  }

  // Exclui um departamento por ID
  excluirDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
