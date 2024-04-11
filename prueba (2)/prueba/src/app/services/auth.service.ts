import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private verifyTokenUrl = 'http://127.0.0.1:8000/api/auth/verify';

  constructor(private http: HttpClient) {}

  verifyToken(token: string): Observable<any> {
    return this.http.post<any>(this.verifyTokenUrl, { token });
  }

  apiUrl = 'http://127.0.0.1:8000/api/auth';

  verificarCodigo(verificacion: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/verificar`;
    return this.http.post<any>(url, { verificacion, token });
  }

  logout(token: string): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    return this.http.post<any>(url, { token });
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }


}
