import { Component, OnInit } from '@angular/core';
import { Device } from '../../Interfaces/device';
import { DeviceService } from '../../services/device.service';
import {  ReparacionDispositivo } from '../../Interfaces/api-response';
import { ReparacionDispositivoService } from '../../services/reparacion-dispositivos.service';
import { ApiResponse2, ApiResponse4 , ApiResponse} from '../../Interfaces/api-response';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReparacionService } from '../../services/reparacion.service';
import { Reparacion } from '../../Interfaces/reparacion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-reparacion-dispositivo',
  standalone: true,
  imports: [RouterModule, FormsModule,RouterModule, CommonModule],
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

  constructor(private AuthService: AuthService , private reparacionDispositivoService: ReparacionDispositivoService, private deviceService: DeviceService, private reparacionService: ReparacionService) { }

  ngOnInit(): void {
    this.loadReparacionDispositivos();
    this.loadDevices();
    this.loadReparaciones();
    this.loadUserRole();
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
    this.reparacionDispositivoService.addReparacionDispositivo(this.newReparacionDispositivo, token).subscribe(
      response => {
        this.loadReparacionDispositivos();
        this.message = response.msg;
        // Limpiar campos u otro manejo necesario
        this.newReparacionDispositivo = { id: 0, dispositivo_id: 0, reparaciones_id: 0, precio: '' };

      },
      error => {
        this.message = 'Error al agregar reparación de dispositivo. Por favor, inténtelo de nuevo.';
        console.log(error);
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
  

  editReparacionDispositivo(reparacionDispositivo: ReparacionDispositivo): void {
    this.tempReparacionDispositivo = { ...reparacionDispositivo };
  }

  updateReparacionDispositivo(): void {
    const token = localStorage.getItem('token') || '';
    if (this.tempReparacionDispositivo) {
      this.reparacionDispositivoService.updateReparacionDispositivo(this.tempReparacionDispositivo, token).subscribe(
        response => {
          this.loadReparacionDispositivos(); // Recarga los datos después de la actualización
          this.tempReparacionDispositivo = null;
          this.message = response.msg;
        },
        error => {
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
      },
      error => {
        this.message = 'Error al eliminar reparación de dispositivo. Por favor, inténtelo de nuevo.';
      }
    );
  }

  cancelEdit(): void {
    this.tempReparacionDispositivo = null;
  }
}
