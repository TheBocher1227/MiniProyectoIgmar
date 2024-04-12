import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiResponse8, IngresoReparacion } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class IngresoReparacionService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) {}

  storeIngreso(ingreso: IngresoReparacion, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/storeingreso`, ingreso, { headers });
  }

  updateIngreso(ingreso: IngresoReparacion, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/editaringreso/${ingreso.id}`, ingreso, { headers });
  }

  deleteIngreso(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/eliminaringreso/${id}`, { headers });
  }

  getIngresos(token: string): Observable<ApiResponse8> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse8>(`${this.apiUrl}/obteneringreso`, { headers });
  }
}
