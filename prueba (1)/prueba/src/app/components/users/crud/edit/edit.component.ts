import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { MessageService } from '../../../../services/message.service';
import { Router } from '@angular/router';
import { CreateUser } from '../../../../Interfaces/create-user';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  registerMessage: string = '';
  state: boolean = false;

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    role_id: new FormControl('3')
  });

  constructor(private usersService: UsersService, private router: Router, private messageService: MessageService) {}

  register() {
    this.registerMessage = '';
    const name = this.registerForm.value.name;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const role_id = parseInt(this.registerForm.value.role_id ?? '3');

    if (name && email && password && role_id) {
      const user: CreateUser = { name, email, password, role_id };
      const token = localStorage.getItem('token'); // Obtener el token guardado en el localStorage
      if (token) {
        this.usersService.addUser(user, token).subscribe({
          next: (data) => {
            this.messageService.updateMessage('Registro exitoso. Se ha enviado un correo de verificación a tu correo. Verifica tu cuenta para iniciar sesión');
            this.registerMessage = 'Registro exitoso. Por favor, valide la cuenta.';
            this.state = true;
            this.registerForm.reset({
              name: '',
              email: '',
              password: '',
              role_id: '3' // Puedes establecer el valor por defecto aquí si lo deseas
            });            
          },
          error: error => {
            console.log(error);
            if (error.error.data && error.error.data.name) {
              this.registerMessage = error.error.data.name.join(' ');
            } else if (error.error.data && error.error.data.email) {
              this.registerMessage = error.error.data.email.join(' ');
            } else if (error.error.data && error.error.data.password) {
              this.registerMessage = error.error.data.password.join(' ');
            } else {
              this.registerMessage = 'Error al registrarse. Por favor, intente de nuevo.';
            }
            this.state = false;
          }
        });
      }
    }
  }
  
  resetForm(): void {
    this.registerForm.reset({
      name: '',
      email: '',
      password: '',
      role_id: '3'
    });
  }

  ngOnInit(): void {
    this.resetForm();
  }

}
