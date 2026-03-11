import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estados } from '../../interfaces/configuracao/estados';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {

  private readonly API_URL = '/api/estado';
  private readonly http = inject(HttpClient);

  //trancode = Recuperar o token.
  trancode = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGYWUzLVM5Zk94RDM5T2ZtTlJNRndwYXZSUGlqT0loVzdJTnN5bkVDQkJnIn0.eyJleHAiOjE3NzMyMjA1NjksImlhdCI6MTc3MzE4NDU3MCwianRpIjoib25ydHJvOjM3NTcyNzE5LWIwZWUtOTVkOC00Y2MzLTQxMzViY2IzOWMzNCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZWFsbXMvcmVhbG0tY29udmVuY2FvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjczZTQ1MjU3LTVjZjgtNGY3Yy04MWE5LTQ0MzU0NTMzY2Y1OCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNsaS1jb25mcmF0ZXJlcyIsInNpZCI6IjI0MDNmMGEwLWRkMjItYjMyMS1hYzg4LTUxZDUyMzE0MzAyMSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiVF9DRlRfQURNSU5JU1RSQURPUiIsImRlZmF1bHQtcm9sZXMtcmVhbG0tY29udmVuY2FvIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkxvZG92aWNvIEFyZGlzc8OjbyIsInByZWZlcnJlZF91c2VybmFtZSI6ImxvZG92aWtvIiwiZ2l2ZW5fbmFtZSI6IkxvZG92aWNvIiwiZmFtaWx5X25hbWUiOiJBcmRpc3PDo28iLCJlbWFpbCI6ImxvZG92aWtvQGdtYWlsLmNvbSJ9.avDFvzIEBx5m4GUWZF7KdEqwG0wCr1zmhNVxHYp96T9W7BbM4UeND59qKsg6QkGATbISckLwqft7Xv8wzGATV5D70uFiRnejHh8JMHFXJu66I690fiYUAuxjX30EB16KE4jLG9dicpCXo9mIjehe87ecH6y4hXoDbKQXkQjGbul8_OAlhQ7X0fZOD0hHoKSR10q4CoZBmh1n17AVh-IibdBesOmE5Q3chmdUOLlhz551fM9UX-gb8-o9fluLdAQnmSSA03167-tYV0uBSs2b0rpQjwzChv8xkH2ojRXwa_KMfpl4ju3TpLjuo44ovYMNLhglNQftVRZBtB7cr7y8kA';

  listarEstados(): Observable<Estados[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.trancode}`)

   // console.log('listarEstados: ', headers );
    return this.http.get<Estados[]>(this.API_URL + '/listar', { headers });
  }

}
