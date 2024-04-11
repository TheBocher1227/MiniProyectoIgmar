import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable , of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['login']);
      return of(false);
    }

    const expectedRole = route.data['role'];
    return this.authService.verifyToken(token).pipe(
      map((response) => {
        const tipoUsuario = response['tipo usuario'];
        console.log(tipoUsuario);
        if (response.isActive && this.checkRole(tipoUsuario, expectedRole)) {
          
          return true;
        } else {
          
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error verifying token:', error);
        this.router.navigate(['login']);
        return of(false);
      })
    );
  }

  private checkRole(userRole: number, expectedRole: number | number[]): boolean {
    if (Array.isArray(expectedRole)) {
      return expectedRole.includes(userRole);
    } else {
      return userRole === expectedRole;
    }
  }
}







