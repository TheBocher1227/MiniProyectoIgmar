import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css', 
})

export class IndexComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadUserRole();
  }
  logout(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.logout(token).subscribe({
        next: () => {
          this.authService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error(error);
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  rolUsuario: number = 0;
  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
        
      });
    }
  }
}
