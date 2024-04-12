// reparacion-dispositivo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse4, ReparacionDispositivo } from '../Interfaces/api-response';
@Injectable({
  providedIn: 'root'
})
export class ReparacionDispositivoService {

  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) { }

  getReparacionDispositivos(token: string): Observable<ApiResponse4> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse4>(`${this.apiUrl}/obtenerreparaciondispositivo`, { headers });
  }

  addReparacionDispositivo(reparacionDispositivo: ReparacionDispositivo, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storereparaciondispositivo`, reparacionDispositivo, { headers });
  }

  updateReparacionDispositivo(reparacionDispositivo: ReparacionDispositivo, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarreparaciondispositivo/${reparacionDispositivo.id}`, reparacionDispositivo, { headers });
  }

  deleteReparacionDispositivo(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarreparaciondispositivo/${id}`, { headers });
  }
}
