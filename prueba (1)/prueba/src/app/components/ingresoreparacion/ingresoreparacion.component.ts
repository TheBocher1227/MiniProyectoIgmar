import { Component, OnInit } from '@angular/core';
import { ApiResponse, ApiResponse2, ApiResponse8, IngresoReparacion } from '../../Interfaces/api-response';
import { IngresoReparacionService } from '../../services/ingreso-reparacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../Interfaces/user-interface';
import { UsersService } from '../../services/users.service';
import { Device } from '../../Interfaces/device';
import { DeviceService } from '../../services/device.service';
import { Reparacion } from '../../Interfaces/reparacion';
import { ReparacionService } from '../../services/reparacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ingresoreparacion',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
  templateUrl: './ingresoreparacion.component.html',
  styleUrl: './ingresoreparacion.component.css'
})
export class IngresoReparacionComponent implements OnInit {
  ingresos: IngresoReparacion[] | undefined;
  nuevoIngreso: IngresoReparacion = {
    id: 0,
    user: 0,
    dispositivo: 0,
    reparacion: 0,
    descripcion: '',
    fecha_ingreso: new Date(),
    estatus: ''
  };
  mensaje: string | null = null;
  rolUsuario: number = 0;
  edicionActiva = false; // Variable para controlar la edición activa
  ingresoEditado: IngresoReparacion = {
    id: 0,
    user: 0,
    dispositivo: 0,
    reparacion: 0,
    descripcion: '',
    fecha_ingreso: new Date(),
    estatus: ''
  };
  users: User[] | undefined;
  devices: Device[] | undefined;
  reparaciones: Reparacion[] | undefined;
  
  ingresoEditadoBackup: IngresoReparacion | null = null;

  constructor(private AuthService: AuthService,private reparacionService: ReparacionService,private ingresoReparacionService: IngresoReparacionService, private userService: UsersService, private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadIngresos();
    this.loadUsers();
    this.loadIngresos();
    this.loadReparaciones();
    this.loadDevices();
    this.loadUserRole();
  }

  loadIngresos(): void {
    const token = localStorage.getItem('token') || '';
    this.ingresoReparacionService.getIngresos(token).subscribe((response: ApiResponse8) => {
      this.ingresos = response['data :'];
    });
  }

  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.AuthService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
      });
    }
  }

  loadReparaciones(): void {
    const token = localStorage.getItem('token') || '';
    this.reparacionService.getReparaciones(token).subscribe((response: ApiResponse2) => {
      this.reparaciones = response['data :'];
    });
  }
  
  loadDevices(): void {
    const token = localStorage.getItem('token') || '';
    this.deviceService.getDevices(token).subscribe((response: ApiResponse) => {// Añade esta línea
      this.devices = response['data :'];
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(response => {
      this.users = response['data: '];
    });
  }

  agregarIngreso(): void {
    const token = localStorage.getItem('token') || '';
    this.ingresoReparacionService.storeIngreso(this.nuevoIngreso, token).subscribe(
      response => {
        this.loadIngresos();
        this.nuevoIngreso = {
          id: 0,
          user: 0,
          dispositivo: 0,
          reparacion: 0,
          descripcion: '',
          fecha_ingreso: new Date(),
          estatus: ''
        };
        this.mensaje = response.Msg;
      },
      error => {
        this.mensaje = 'Error al agregar ingreso. Por favor, inténtelo de nuevo.';
      }
    );
  }

  editarIngreso(ingreso: IngresoReparacion): void {
    this.ingresoEditadoBackup = JSON.parse(JSON.stringify(ingreso)); // Copia profunda del ingreso
    this.ingresoEditado = { ...ingreso }; // Copia superficial para edición
    this.edicionActiva = true; // Activar la edición
}


  cancelarEdicion(): void {
    if (this.ingresoEditadoBackup) {
      this.ingresoEditado = { ...this.ingresoEditadoBackup }; // Restaurar desde copia de respaldo
      this.ingresoEditadoBackup = null; // Limpiar copia de respaldo
    }
    this.edicionActiva = false; // Desactivar la edición
  }

  actualizarIngreso(): void {
    if (this.ingresoEditado) { // Verificar que ingresoEditado no sea null
      const token = localStorage.getItem('token') || '';
      this.ingresoReparacionService.updateIngreso(this.ingresoEditado, token).subscribe(
        response => {
          this.loadIngresos();
          this.mensaje = response.msg;
          this.edicionActiva = false;
          this.ingresoEditadoBackup = null;
        },
        error => {
          this.mensaje = 'Error al actualizar ingreso. Por favor, inténtelo de nuevo.';
          console.log(error);
        }
      );
    }
  }
  

  eliminarIngreso(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.ingresoReparacionService.deleteIngreso(id, token).subscribe(
      response => {
        this.loadIngresos();
        this.mensaje = response.msg;
      },
      error => {
        this.mensaje = 'Error al eliminar ingreso. Por favor, inténtelo de nuevo.';
      }
    );
  }
}
