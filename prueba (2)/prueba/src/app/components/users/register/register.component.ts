import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerMessage: string = '';
  state: boolean = false;
  

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });


  constructor(private usersService: UsersService, private router: Router, private messageService: MessageService) {}

  register() {
    this.registerMessage = '';
    const name = this.registerForm.value.name;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
  
    if (name && email && password) {
      this.usersService.register({ name, email, password }).subscribe({
        next: (data) => {
          console.log(data);
          this.messageService.updateMessage('Registro exitoso. Se ha enviado un correo de verficiacion a tu correo. Verifica tu cuenta para iniciar sesion');
          this.registerMessage = 'Registro exitoso. Por favor, inicie sesión.';
          this.state = true;
          this.router.navigate(['/login']);  // Redirige al usuario a '/login'
        },
        error: error => {
          console.log(error);
          if (error.error.data && error.error.data.name) {
            this.registerMessage = error.error.data.name.join(' ');  // Muestra el mensaje de error para 'name'
          } else if (error.error.data && error.error.data.email) {
            this.registerMessage = error.error.data.email.join(' ');  // Muestra el mensaje de error para 'email'
          } else if (error.error.data && error.error.data.password) {
            this.registerMessage = error.error.data.password.join(' ');  // Muestra el mensaje de error para 'password'
          } else {
            this.registerMessage = 'Error al registrarse. Por favor, intente de nuevo.';
          }
          this.state = false;
        }
      });
    } 
  }
}



