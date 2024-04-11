import { Component, ViewChild , ElementRef , AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../Interfaces/user-interface';
import { UsersService } from '../../../services/users.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RegisterComponent } from "../register/register.component";
import { AgregarusersComponent } from './agregarusers/agregarusers.component';
import { EditComponent } from "./edit/edit.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, first, interval, startWith, switchMap } from 'rxjs';
import { Token } from '@angular/compiler';
declare var $: any;
@Component({
    selector: 'app-crud',
    standalone: true,
    templateUrl: './crud.component.html',
    styleUrl: './crud.component.css',
    imports: [RouterModule, CommonModule, RegisterComponent, AgregarusersComponent, EditComponent , ReactiveFormsModule]
})
export class CrudComponent implements OnInit, OnDestroy {
  users: User[] | undefined;
  rolUsuario: number = 0;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  registerMessage: any;
  pollingsuscription :Subscription = new Subscription();
  token = localStorage.getItem('token');
  selectedUserId: any;
  @ViewChild('editModal') editModal!: ElementRef;



  constructor(private userService: UsersService, private AuthService: AuthService , private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol_id: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserRole();
    this.pollingsuscription=interval(5000).pipe(
      startWith(0), 
      switchMap(() => this.userService.getUsers()),  
    ).subscribe(response => {
      this.users = response['data: '];
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(response => {
      this.users = response['data: '];
    });
  }

  ngOnDestroy(): void {
      this.pollingsuscription.unsubscribe();
  }

  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.AuthService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
      });
    }
  }

  adduser(): void {
    this.loadUsers();
  }

  editUser(user: User): void {
    this.registerForm.patchValue(user);
    
    this.selectedUserId = user.id;
  }
  
  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
  
    this.loading = true;
    const token = localStorage.getItem('token');
    const userId = this.selectedUserId; // Usar el ID del usuario seleccionado
    if (token && userId) {
      this.userService.editUser(userId, this.registerForm.value, token)
        .pipe(first())
        .subscribe(
          data => {
            alert('Usuario actualizado correctamente');
            this.loadUsers();
            this.loading = false;
          },
          error => {
            console.log(error);
            if (error.error.data && error.error.data.name) {
              this.registerMessage = error.error.data.name.join(' ');  // Muestra el mensaje de error para 'name'
            } else if (error.error.data && error.error.data.email) {
              this.registerMessage = error.error.data.email.join(' ');  // Muestra el mensaje de error para 'email'
            } else if (error.error.data && error.error.data.rol_id) {
              this.registerMessage = error.error.data.rol_id.join(' ');  // Muestra el mensaje de error para 'rol_id'
            } else {
              this.registerMessage = 'Error al registrarse. Por favor, intente de nuevo.';
            }
          }
        );
    }
  }
  

  confirmDeleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.deleteUser(userId, token).subscribe(() => {
        alert('Usuario eliminado correctamente');
        this.loadUsers(); // Recargar la lista de usuarios después de eliminar
      }, error => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario. Por favor, inténtalo de nuevo.');
      });
    }
  }

}
