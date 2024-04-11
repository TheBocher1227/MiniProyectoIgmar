import { Component, OnInit } from '@angular/core';
import { Device } from '../../Interfaces/device';
import { DeviceService } from '../../services/device.service';
import {  ReparacionDispositivo } from '../../Interfaces/api-response';
import { ReparacionDispositivoService } from '../../services/reparacion-dispositivos.service';
import { ApiResponse2, ApiResponse4 , ApiResponse} from '../../Interfaces/api-response';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReparacionService } from '../../services/reparacion.service';
import { Reparacion } from '../../Interfaces/reparacion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-reparacion-dispositivo',
  standalone: true,
  imports: [RouterModule, FormsModule,RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reparacion-dispositivo.component.html',
  styleUrls: ['./reparacion-dispositivo.component.css']
})
export class ReparacionDispositivoComponent implements OnInit {
  reparacionDispositivos: ReparacionDispositivo[] = [];
  devices: Device[] = [];
  reparaciones: Reparacion[] = [];
  newReparacionDispositivo: ReparacionDispositivo = { id: 0, dispositivo_id: 0, reparaciones_id: 0, precio: '' };
  message: string | null = null;
  tempReparacionDispositivo: ReparacionDispositivo | null = null;
  rolUsuario: number = 0;
  newReparacionDispositivoForm: FormGroup = new FormGroup({});
  editReparacionDispositivoForm: FormGroup = new FormGroup({});
  selectedReparacionDispositivo: ReparacionDispositivo | null = null;
  constructor(private AuthService: AuthService , private reparacionDispositivoService: ReparacionDispositivoService, private deviceService: DeviceService, private reparacionService: ReparacionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadReparacionDispositivos();
    this.loadDevices();
    this.loadReparaciones();
    this.loadUserRole();
    this.newReparacionDispositivoForm = this.fb.group({
      dispositivo_id: ['', Validators.required],
      reparaciones_id: ['', Validators.required],
      precio: ['', Validators.required]
    });

    this.editReparacionDispositivoForm = this.fb.group({
      dispositivo_id: ['', Validators.required],
      reparaciones_id: ['', Validators.required],
      precio: ['', Validators.required]
    });

  }

  loadReparacionDispositivos(): void {
    const token = localStorage.getItem('token') || '';
    this.reparacionDispositivoService.getReparacionDispositivos(token).subscribe((response: ApiResponse4) => {
      this.reparacionDispositivos = response['data :'] || [];
      console.log(response['data :']);
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
    this.deviceService.getDevices(token).subscribe((response: ApiResponse) => {
      this.devices = response['data :'] || [];
    });
  }

  loadReparaciones(): void {
    const token = localStorage.getItem('token') || '';
    this.reparacionService.getReparaciones(token).subscribe((response: ApiResponse2) => {
      this.reparaciones = response['data :'];
      console.log(this.reparaciones);
    });
  }

  addReparacionDispositivo(): void {
    const token = localStorage.getItem('token') || '';
    console.log(this.newReparacionDispositivoForm);
    this.reparacionDispositivoService.addReparacionDispositivo(this.newReparacionDispositivoForm.value, token).subscribe(
      response => {
        this.loadReparacionDispositivos();
        this.message = response.msg;
        // Limpiar campos u otro manejo necesario
        this.newReparacionDispositivo = { id: 0, dispositivo_id: 0, reparaciones_id: 0, precio: '' };
        this.newReparacionDispositivoForm.reset();
      },
      error => {
        this.message = 'Error al agregar reparación de dispositivo. Por favor, inténtelo de nuevo.';
        console.log(error);
        console.log(this.newReparacionDispositivoForm.get('dispositivo_id')?.errors);
      }
    );
  }

  getDeviceName(id: number): string {
    const device = this.devices.find(device => device.id === id);
    return device ? `${device.marca} ${device.modelo}` : '';
  }
  
  getReparacionName(id: number): string {
    const reparacion = this.reparaciones.find(reparacion => reparacion.id === id);
    return reparacion ? reparacion.tipo_reparaciones : '';
  }
  
  editingMode: boolean = false;
  editReparacionDispositivo(reparacionDispositivo: ReparacionDispositivo): void {
    this.tempReparacionDispositivo = { ...reparacionDispositivo };
    this.selectedReparacionDispositivo = reparacionDispositivo
    this.editingMode = true;
    this.message=null;
    this.editReparacionDispositivoForm.patchValue({
      dispositivo_id: reparacionDispositivo.dispositivo_id,
      reparaciones_id: reparacionDispositivo.reparaciones_id,
      precio: reparacionDispositivo.precio
    });
    
  }

  updateReparacionDispositivo(): void {
    const token = localStorage.getItem('token') || '';
    if (this.tempReparacionDispositivo) {
      this.tempReparacionDispositivo.dispositivo_id = this.editReparacionDispositivoForm.get('dispositivo_id')?.value;
      this.tempReparacionDispositivo.reparaciones_id = this.editReparacionDispositivoForm.get('reparaciones_id')?.value;
      this.tempReparacionDispositivo.precio = this.editReparacionDispositivoForm.get('precio')?.value
      console.log(this.tempReparacionDispositivo);
      this.reparacionDispositivoService.updateReparacionDispositivo(this.tempReparacionDispositivo, token).subscribe(
        response => {
          this.loadReparacionDispositivos(); // Recarga los datos después de la actualización
          this.tempReparacionDispositivo = null;
          this.message = response.msg;
          this.editingMode = false;
        },
        error => {
          console.log(error);
          this.message = 'Error al actualizar reparación de dispositivo. Por favor, inténtelo de nuevo.';
        }
      );
    }
  }
  

  deleteReparacionDispositivo(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.reparacionDispositivoService.deleteReparacionDispositivo(id, token).subscribe(
      response => {
        this.loadReparacionDispositivos();
        this.message = response.msg;
        if (this.editingMode && this.tempReparacionDispositivo && this.tempReparacionDispositivo.id === id) {
          this.cancelEdit();
        }
      },
      error => {
        this.message = 'Error al eliminar reparación de dispositivo. Por favor, inténtelo de nuevo.';
      }
    );
  }

  cancelEdit(): void {
    this.tempReparacionDispositivo = null;
    this.editingMode = false;
  }
}
