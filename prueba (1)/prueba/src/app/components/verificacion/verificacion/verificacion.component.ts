import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule,FormsModule],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css'
})
export class VerificacionComponent {
  codigoVerificacion: string = '';
  mensaje: string = '';

  constructor(private authService: AuthService,  private router: Router) {}

  verificarCodigo(form: NgForm) {
    const verificacion = form.value.verificacion;
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado en el localStorage');
      return;
    }

    this.authService.verificarCodigo(verificacion, token).subscribe({
      next: (response) => {
        console.log(response);
        this.mensaje = response.message;
        this.router.navigateByUrl('/index', { replaceUrl: true });
      },
      error: (error) => {
        console.error(error);
        this.mensaje = "Codigo invalido, verifica el codigo.";
      }
    });
    
  }

}
