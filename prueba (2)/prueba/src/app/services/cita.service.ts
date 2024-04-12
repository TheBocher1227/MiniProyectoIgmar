import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse5, ApiResponse7, Cita } from '../Interfaces/api-response';
import { OrdenVenta } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth'; 

  constructor(private http: HttpClient) { }

  getOrdenesVenta(token: string): Observable<ApiResponse7> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse7>(`${this.apiUrl}/obtenercita`, { headers });
  }

  addOrdenVenta(cita: Cita, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storecita`, cita, { headers });
  }

  updateordenventa(cita: Cita, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarcita/${cita.id}`, cita, { headers });
  }


  deleteordenventa(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarcita/${id}`, { headers });
  }
}