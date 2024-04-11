import { Component, OnInit } from '@angular/core';
import { IngresoReparacionService } from '../../services/ingreso-reparacion.service';
import { User } from '../../Interfaces/user-interface';
import { Device } from '../../Interfaces/device';
import { Reparacion } from '../../Interfaces/reparacion';
import { AuthService } from '../../services/auth.service';
import { ApiResponse, ApiResponse2, ApiResponse8, IngresoReparacion } from '../../Interfaces/api-response';
import { ReparacionService } from '../../services/reparacion.service';
import { UsersService } from '../../services/users.service';
import { DeviceService } from '../../services/device.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingresoreparacion',
  standalone: true,
  templateUrl: './ingresoreparacion.component.html',
  imports: [CommonModule,RouterOutlet,ReactiveFormsModule],
  styleUrls: ['./ingresoreparacion.component.css']
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
  edicionActiva = false;
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
  nuevoIngresoForm:FormGroup = new FormGroup({});
  editarIngresoForm:FormGroup = new FormGroup({});

  constructor(private AuthService: AuthService, private reparacionService: ReparacionService, private ingresoReparacionService: IngresoReparacionService, private userService: UsersService, private deviceService: DeviceService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadIngresos();
    this.loadUsers();
    this.loadIngresos();
    this.loadReparaciones();
    this.loadDevices();
    this.loadUserRole();
    this.nuevoIngresoForm = this.fb.group({
      user: ['', Validators.required],
      dispositivo: ['', Validators.required],
      reparacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_ingreso: ['', Validators.required],
      estatus: ['', Validators.required]
    });
    this.editarIngresoForm = this.fb.group({
      user: ['', Validators.required],
      dispositivo: ['', Validators.required],
      reparacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_ingreso: ['', Validators.required],
      estatus: ['', Validators.required]
    });

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
    this.deviceService.getDevices(token).subscribe((response: ApiResponse) => {
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
    this.ingresoReparacionService.storeIngreso(this.nuevoIngresoForm.value, token).subscribe(
      response => {
        this.loadIngresos();
        // Restablecer el formulario y el objeto nuevoIngreso después de agregar exitosamente
        this.nuevoIngresoForm.reset();
        this.nuevoIngreso = {
          id: 0,
          user: 0,
          dispositivo: 0,
          reparacion: 0,
          descripcion: '',
          fecha_ingreso: new Date(),
          estatus: ''
        };
        this.mensaje = "Se agrego el ingreso";
      },
      error => {
        this.mensaje = 'Error al agregar ingreso. Por favor, inténtelo de nuevo.';
      }
    );
  }

  editarIngreso(ingreso: IngresoReparacion): void {
    this.ingresoEditadoBackup = JSON.parse(JSON.stringify(ingreso));
    this.ingresoEditado = { ...ingreso };
    this.edicionActiva = true;
    this.editarIngresoForm.patchValue({
      user: ingreso.user,
      dispositivo: ingreso.dispositivo,
      reparacion: ingreso.reparacion,
      descripcion: ingreso.descripcion,
      fecha_ingreso: ingreso.fecha_ingreso, // Asegúrate de formatear la fecha correctamente
      estatus: ingreso.estatus
    });
    this.mensaje = null;
  }

  cancelarEdicion(): void {
    if (this.ingresoEditadoBackup) {
      this.ingresoEditado = { ...this.ingresoEditadoBackup };
      this.ingresoEditadoBackup = null;
    }
    this.edicionActiva = false;
    this.mensaje = null;
  }

  actualizarIngreso(): void {
    if (this.ingresoEditado) {
      const token = localStorage.getItem('token') || '';
      this.ingresoEditado.user = this.editarIngresoForm.get('user')?.value;
this.ingresoEditado.dispositivo = this.editarIngresoForm.get('dispositivo')?.value;
this.ingresoEditado.reparacion = this.editarIngresoForm.get('reparacion')?.value;
this.ingresoEditado.descripcion = this.editarIngresoForm.get('descripcion')?.value;
this.ingresoEditado.fecha_ingreso = this.editarIngresoForm.get('fecha_ingreso')?.value;
this.ingresoEditado.estatus = this.editarIngresoForm.get('estatus')?.value;
      this.ingresoReparacionService.updateIngreso(this.ingresoEditado, token).subscribe(
        response => {
          this.loadIngresos();
          this.mensaje = response.msg;
          this.mensaje = response.msg;
          this.edicionActiva = false;
          this.ingresoEditadoBackup = null;
          this.mensaje = "Se edito correctamente";
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
    if (this.ingresoEditado && this.ingresoEditado.id === id) {
      // Restablecer el formulario de edición y ocultarlo
      this.editarIngresoForm.reset();
      this.ingresoEditado = {
        id: 0,
        user: 0,
        dispositivo: 0,
        reparacion: 0,
        descripcion: '',
        fecha_ingreso: new Date(),
        estatus: ''
      };
      this.edicionActiva = false; // Ocultar el formulario de edición
      this.ingresoEditadoBackup = null;
      this.mensaje = null; //
    }
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