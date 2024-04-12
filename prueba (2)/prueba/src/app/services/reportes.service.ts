import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reporte } from '../Interfaces/api-response';
import { ApiResponse9 } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) { }

  getReportes(token: string): Observable<ApiResponse9> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse9>(`${this.apiUrl}/obtenerreporte`, { headers });
  }

  addReporte(reporte: Reporte, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storereporte`, reporte, { headers });
  }

  updateReporte(reporte: Reporte, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarreporte/${reporte.id}`, reporte, { headers });
  }

  deleteReporte(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarreporte/${id}`, { headers });
  }
}
