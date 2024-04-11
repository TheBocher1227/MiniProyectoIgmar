import { Component, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css', 
})

export class IndexComponent {

  constructor(private authService: AuthService, private router: Router) {
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
}
