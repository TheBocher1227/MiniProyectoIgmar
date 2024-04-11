import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../Interfaces/login';
import { User } from '../Interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private loginURL = "http://127.0.0.1:8000/api/auth/login";
  private token: string|null = null;
  private static instance: LoginService

  constructor(private http: HttpClient) {
    LoginService.instance = this;
  }

  public static getInstance(): LoginService{
    return LoginService.instance
  }
  
  login(email: string, password: string): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/auth/login';
    return this.http.post<Login>(url, { email, password });
  }

  // Obtener y setear token
  setToken(token: string|null){
    this.token = token
  }
  getToken(): string|null{
    return this.token
  }

  // Hacer petición a api
  LogIn(user: Login): Observable<User> {
    return this.http.post<User>(this.loginURL, user)
  }

  Verificar(): Observable<any> {
    let url = 'http://127.0.0.1:8000/api/auth/me'
    return this.http.post<any>(url, null)
  }


  register(user: User): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/auth/register';
    return this.http.post<User>(url, user);
  }
  
  verificarToken(token: string): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/auth/verify';
    return this.http.post<any>(url, { token });
  }
  

}
