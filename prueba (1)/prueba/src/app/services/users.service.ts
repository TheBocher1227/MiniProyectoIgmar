import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { UserRegister } from '../Interfaces/register';
import { User } from '../Interfaces/user-interface';
import { CreateUser } from '../Interfaces/create-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  
  register(user: UserRegister): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/auth/register';
    return this.http.post<UserRegister>(url, user);
  }

  getUsers(): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/auth/get';
    return this.http.get<any>(url);
  }

  addUser(user: CreateUser, token: string): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/auth/post';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(url, user, { headers });
  }


  editUser(userId: number, user: User, token: string): Observable<any> {
    const url = `${this.apiUrl}/put/${userId}`;
    return this.http.put<any>(url, user, { headers: { Authorization: `Bearer ${token}` } });
  }
  

  deleteUser(userId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${userId}`;
    return this.http.delete<any>(url, { headers: { Authorization: `Bearer ${token}` } });
  }

}
