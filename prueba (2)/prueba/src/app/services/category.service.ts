import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../Interfaces/category';
import { ServerResponse } from '../Interfaces/server-respone';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://192.168.116.175:8000/api/auth';

  constructor(private http: HttpClient) {}

  getCategories(token: string): Observable<ServerResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<ServerResponse>(`${this.apiUrl}/obtenercategoria`, { headers });
  }
  

  addCategory(category: Category, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/storecategoria`, category.tipo_categoria, { headers });
  }

  updateCategory(category: Category, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/editarcategoria/${category.id}`, category, { headers });
  }

  deleteCategory(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarcategoria/${id}`, { headers });
  }
}
