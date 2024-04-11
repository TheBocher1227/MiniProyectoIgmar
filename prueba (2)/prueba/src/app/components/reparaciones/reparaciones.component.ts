import { Component, OnInit } from '@angular/core';
import { Reparacion } from '../../Interfaces/reparacion';
import { ReparacionService } from '../../services/reparacion.service';
import { ServerResponse } from '../../Interfaces/server-respone';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiResponse2 } from '../../Interfaces/api-response';
import Echo from 'laravel-echo';
import { ChangeDetectorRef } from '@angular/core';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-reparaciones',
  standalone: true,
  templateUrl: './reparaciones.component.html',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./reparaciones.component.css']
})
export class ReparacionesComponent implements OnInit {
  echo: Echo | undefined;
  newReparacion: Reparacion = { id: 0, tipo_reparaciones: '' };
  reparaciones: Reparacion[] | undefined;
  message: string | null = null;
  rolUsuario: number = 0;
  selectedReparacion: Reparacion | null = null;
  tempReparacion: Reparacion | null = null;
  registerMessage: string | null = null;
  newReparacionForm: FormGroup = new FormGroup({});
  EditForm: FormGroup = new FormGroup({});
  constructor(private reparacionService: ReparacionService, private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadReparaciones();
    this.loadUserRole();
    this.setupWebSocket();
    this.EditForm = this.fb.group({
      tipo_reparaciones: ['', Validators.required]
    });
    this.newReparacionForm = this.fb.group({
      tipo_reparaciones: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {
    this.closeWebSocket();
  }
  setupWebSocket(): void {
    (window as any).Pusher = Pusher;
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '123', 
      cluster: 'mt1',
      encrypted: false,
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStatus: true
    });

    this.echo.channel('nuevareparacion').listen('.App\\Events\\NuevaReparacion', (e: any) => {
      console.log(e);
     
      this.loadReparaciones(); 
    });
  }

  closeWebSocket(): void {
    if (this.echo) {
      this.echo.disconnect();
    }
  }


  loadReparaciones(): void {
    const token = localStorage.getItem('token') || '';
    this.reparacionService.getReparaciones(token).subscribe((response: ApiResponse2) => {
      this.reparaciones = response['data :'];
      console.log(this.reparaciones);
    });
  }
  

  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
      });
    }
  }

  addReparacion(newReparacionValue: string): void {
    const token = localStorage.getItem('token') || '';
    const newReparacion: Reparacion = { id: 0, tipo_reparaciones: newReparacionValue };
    this.reparacionService.addReparacion(this.newReparacionForm.value, token).subscribe(
      response => {
        this.loadReparaciones();
        this.registerMessage = response.msg;
        this.message = response.msg;
        this.newReparacionForm.reset();
      },
      error => {
        this.registerMessage = 'Error al agregar reparación. Por favor, inténtelo de nuevo.';
        this.message = error.error.msg;
      }
    );
  }

  editReparacion(reparacion: Reparacion): void {
    this.selectedReparacion = reparacion;
    this.tempReparacion = { ...reparacion };
    this.EditForm.patchValue({
      tipo_reparaciones: reparacion.tipo_reparaciones
    });
  }

  updateReparacion(): void {
    const token = localStorage.getItem('token') || '';
    
    if (this.tempReparacion) {
      this.tempReparacion.tipo_reparaciones = this.EditForm.get("tipo_reparaciones")?.value;
      this.reparacionService.updateReparacion(this.tempReparacion, token).subscribe(
        response => {
          this.loadReparaciones();
          this.selectedReparacion = null;
          this.tempReparacion = null;
          this.registerMessage = response.msg;
          this.message = response.msg;
          this.EditForm.reset();
        },
        error => {
          this.registerMessage = 'Error al actualizar reparación. Por favor, inténtelo de nuevo.';
          this.message = error.error.msg;
        }
      );
    }
  }

  deleteReparacion(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.reparacionService.deleteReparacion(id, token).subscribe(
      response => {
        this.loadReparaciones();
        this.registerMessage = response.msg;
        this.message = response.msg;
        if (this.selectedReparacion && this.selectedReparacion.id === id) {
          this.cancelEdit(); // Llama a cancelEdit para resetear el formulario y las variables
        }
      },
      error => {
        this.registerMessage = 'Error al eliminar reparación. Por favor, inténtelo de nuevo.';
        this.message = error.error.msg;
      }
    );
  }

  cancelEdit(): void {
    this.selectedReparacion = null;
    this.tempReparacion = null;
  }
}
