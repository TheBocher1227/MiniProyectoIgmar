import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accesorio } from '../Interfaces/accesorio';
import { ApiResponse, ApiResponse3 } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class AccesorioService {

  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) { }

  // Cambia el tipo de retorno del método getAccesorios()
  getAccesorios(token: string): Observable<ApiResponse3> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse3>(`${this.apiUrl}/obteneraccesorio`, { headers });
  }

  addAccesorio(accesorio: Accesorio, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storeaccesorio`, accesorio, { headers });
  }

  updateAccesorio(accesorio: Accesorio, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editaraccesorio/${accesorio.id}`, accesorio, { headers });
  }

  deleteAccesorio(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminaraccesorio/${id}`, { headers });
  }
}
