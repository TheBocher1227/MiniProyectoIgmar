import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiResponse5 } from '../Interfaces/api-response';
import { OrdenVenta } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth'; // Cambia por tu URL de la API

  constructor(private http: HttpClient) { }

  getOrdenesVenta(token: string): Observable<ApiResponse5> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse5>(`${this.apiUrl}/obtenerordenventa`, { headers });
  }

  addOrdenVenta(ordenventa: OrdenVenta, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storeordenventa`, ordenventa, { headers });
  }

  updateordenventa(ordenventa: OrdenVenta, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarordenventa/${ordenventa.id}`, ordenventa, { headers });
  }


  deleteordenventa(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarordenventa/${id}`, { headers });
  }
}
