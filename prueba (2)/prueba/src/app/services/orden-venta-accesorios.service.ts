import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiResponse5, ApiResponse6, OrdenVentaAccesorios } from '../Interfaces/api-response';
import { OrdenVenta } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaAService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth'; 

  constructor(private http: HttpClient) { }

  getOrdenesVentaA(token: string): Observable<ApiResponse6> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse6>(`${this.apiUrl}/obtenerordenventaA`, { headers });
  }

  addOrdenVentaA(ordenventa: OrdenVentaAccesorios, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storeordenventaA`, ordenventa, { headers });
  }

  updateordenventaA(ordenventa: OrdenVentaAccesorios, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarordenventaA/${ordenventa.id}`, ordenventa, { headers });
  }


  deleteordenventaA(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarordenventaA/${id}`, { headers });
  }
}