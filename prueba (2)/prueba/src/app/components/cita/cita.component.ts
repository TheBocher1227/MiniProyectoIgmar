import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiResponse, ApiResponse7, Cita } from '../../Interfaces/api-response';
import { CitaService } from '../../services/cita.service';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../Interfaces/device';
import { User } from '../../Interfaces/user-interface';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.css'
})
export class CitaComponent implements OnInit {
  citas: Cita[] = [];
  citaEditada: Cita | null = null;
  citaEditadaBackup: Cita | null = null;
  nuevaCita: Cita = { id: 0, fecha_cita: new Date(), motivo_cita: '', estado_cita: '',  dispositivo: '', usuario: 0, hora_cita: Date.now().toString() };
  mensaje: string | null = null;
  devices: Device[] | undefined;
  users: User[] | undefined;
  rolUsuario: number = 0;
  edicionActiva = false; // Variable para controlar la edición activa
  nuevoCitaForm: FormGroup = new FormGroup({});
  editarCitaForm: FormGroup=new FormGroup({});
  constructor(private AuthService: AuthService,private citaService: CitaService, private deviceService: DeviceService, private userService: UsersService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarCitas();
    this.loadDevices();
    this.loadUsers();
    this.loadUserRole();
    this.nuevoCitaForm = this.fb.group({
      fecha_cita: ['', Validators.required],
      motivo_cita: ['', Validators.required],
      estado_cita: ['', Validators.required],
      dispositivo: ['', Validators.required],
      usuario: ['', Validators.required],
      hora_cita: ['', Validators.required]
    });

    this.editarCitaForm = this.fb.group({
      fecha_cita: ['', Validators.required],
      motivo_cita: ['', Validators.required],
      estado_cita: ['', Validators.required],
      dispositivo: ['', Validators.required],
      usuario: ['', Validators.required],
      hora_cita: ['', Validators.required]
    });
  }

  cargarCitas(): void {
    const token = localStorage.getItem('token') || '';
    this.citaService.getOrdenesVenta(token).subscribe((response: ApiResponse7) => {
      this.citas = response['data :'] || [];
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

  editarCita(cita: Cita): void {
    this.citaEditadaBackup = { ...cita }; // Crear una copia de respaldo
  this.citaEditada = { ...cita }; // Usar una copia para editar
  this.edicionActiva = true; // Activar la edición

  // Cargar los datos en el formulario de edición
  this.editarCitaForm.patchValue({
    fecha_cita: this.citaEditada.fecha_cita,
    motivo_cita: this.citaEditada.motivo_cita,
    estado_cita: this.citaEditada.estado_cita,
    dispositivo: this.citaEditada.dispositivo,
    usuario: this.citaEditada.usuario,
    hora_cita: this.citaEditada.hora_cita
  });// Activar la edición
  }

  cancelarEdicion(): void {
    if (this.edicionActiva) {
      if (this.citaEditadaBackup) {
        this.citaEditada = { ...this.citaEditadaBackup }; // Restaurar desde la copia de respaldo
        this.citaEditadaBackup = null; // Limpiar la copia de respaldo
      }
      this.edicionActiva = false; // Desactivar la edición
    } else {
      this.citaEditada = null; // Limpiar la cita editada
    }
  }


  actualizarCita(): void {
    if (this.citaEditada) {
      const token = localStorage.getItem('token') || '';
      this.citaEditada.fecha_cita = this.editarCitaForm.get('fecha_cita')?.value;
      this.citaEditada.motivo_cita = this.editarCitaForm.get('motivo_cita')?.value;
      this.citaEditada.estado_cita = this.editarCitaForm.get('estado_cita')?.value;
      this.citaEditada.dispositivo = this.editarCitaForm.get('dispositivo')?.value;
      this.citaEditada.usuario = this.editarCitaForm.get('usuario')?.value;
      this.citaEditada.hora_cita = this.editarCitaForm.get('hora_cita')?.value;
      this.citaService.updateordenventa(this.citaEditada, token).subscribe(
        response => {
          this.cargarCitas();
          this.citaEditada = null;
          this.citaEditadaBackup = null;
          this.mensaje = response.msg;
          this.editarCitaForm.reset();
        },
        error => {
          this.mensaje = 'Error al actualizar cita. Por favor, inténtelo de nuevo.';
        }
      );
    }
  }

  agregarCita(): void {
    const token = localStorage.getItem('token') || '';
    this.citaService.addOrdenVenta(this.nuevoCitaForm.value, token).subscribe(
      response => {
        this.cargarCitas();
        this.nuevaCita = { id: 0, fecha_cita: new Date(), motivo_cita: '', estado_cita: '',  dispositivo: '', usuario: 0, hora_cita: Date.now().toString() };
        this.mensaje = response.msg;
        this.nuevoCitaForm.reset();
      },
      error => {
        this.mensaje = 'Error al agregar cita. Por favor, inténtelo de nuevo.';
        console.log(error);
      }
    );
  }

  eliminarCita(id: number): void {
    const token = localStorage.getItem('token') || '';
    if (this.citaEditada && this.citaEditada.id === id) {
      this.citaEditada = null; // Ocultar el formulario de edición si se está eliminando la orden editada
    }
    this.citaService.deleteordenventa(id, token).subscribe(
      response => {
        this.cargarCitas();
        this.mensaje = "Se elimino la cita";
      },
      error => {
        this.mensaje = 'Error al eliminar cita. Por favor, inténtelo de nuevo.';
      }
    );
  }
}