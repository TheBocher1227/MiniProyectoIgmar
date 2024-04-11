import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginMessage: string = '';
  registerMessage: string = '';
  state: boolean = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService, private router: Router, private messageService: MessageService) { }
  ngOnInit(): void {
    this.messageService.currentMessage.subscribe(message => this.registerMessage = message);
    setTimeout(() => {
      this.registerMessage = '';
    }, 5000);
  }
  login() {
    this.loginMessage = '';
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    if (email && password) {
      this.loginService.login(email, password).subscribe({
        next: (data) => {
          console.log(data);
          this.loginMessage = 'Inicio de sesión exitoso.'
          this.state = true;
          localStorage.setItem('token', data.access_token);
          console.log(data.access_token)
          console.log(localStorage.getItem('token'));
          this.router.navigateByUrl('/verificacion', { replaceUrl: true });
        },
        error: error => {
          console.log(error.error.msg);
          this.loginMessage = error.error.msg;
          this.state = false;
          console.log(error);
        }
    });
    } 
  }
    
}
