import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reparacion } from '../Interfaces/reparacion';
import { ApiResponse2 } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class ReparacionService {

  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) { }

  getReparaciones(token: string): Observable<ApiResponse2> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse2>(`${this.apiUrl}/obtenerreparacion`, { headers }); 
  }

  addReparacion(reparacion: Reparacion, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storereparacion`, reparacion, { headers });
  }

  updateReparacion(reparacion: Reparacion, token: string ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarreparacion/${reparacion.id}`, reparacion, { headers });
  }

  deleteReparacion(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarreparacion/${id}`, { headers });
  }
}
