// services/device.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../Interfaces/device';
import { ApiResponse } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) {}

  getDevices(token: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse>(`${this.apiUrl}/obtenerdispositivo`, { headers });
  }

  addDevice(device: Device, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/storedispositivo`, device, { headers });
  }

  updateDevice(device: Device, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/editardispositivo/${device.id}`, device, { headers });
  }

  deleteDevice(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/eliminardispositivo/${id}`, { headers });
  }
}
