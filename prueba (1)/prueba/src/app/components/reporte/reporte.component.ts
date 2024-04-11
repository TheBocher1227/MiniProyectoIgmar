import { Component, OnInit } from '@angular/core';
import { ApiResponse8, IngresoReparacion, Reporte } from '../../Interfaces/api-response';
import { ReportesService } from '../../services/reportes.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngresoReparacionService } from '../../services/ingreso-reparacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReportesComponent implements OnInit {
  reportes: Reporte[] | undefined;
  rolUsuario: number = 0;
  nuevoReporte: Reporte = {
    id: 0,
    precio: 0,
    fecha_entrega: new Date(),
    ingreso: 0
  };
  mensaje: string | null = null;
  edicionActiva = false;
  reporteEditado: Reporte = {
    id: 0,
    precio: 0,
    fecha_entrega: new Date(),
    ingreso: 0
  };
  reporteEditadoBackup: Reporte | null = null;
  ingresos: IngresoReparacion[] | undefined;

  constructor(private AuthService: AuthService,private reportesService: ReportesService, private ingresoReparacionService: IngresoReparacionService) { }

  ngOnInit(): void {
    this.loadReportes();
    this.loadIngresos();
    this.loadUserRole();
  }

  loadReportes(): void {
    const token = localStorage.getItem('token') || '';
    this.reportesService.getReportes(token).subscribe(response => {
      this.reportes = response['data :'];
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

  loadIngresos(): void {
    const token = localStorage.getItem('token') || '';
    this.ingresoReparacionService.getIngresos(token).subscribe((response: ApiResponse8) => {
      this.ingresos = response['data :'];
    });
  }

  agregarReporte(): void {
    const token = localStorage.getItem('token') || '';
    this.reportesService.addReporte(this.nuevoReporte, token).subscribe(
      response => {
        this.loadReportes();
        this.nuevoReporte = {
          id: 0,
          precio: 0,
          fecha_entrega: new Date(),
          ingreso: 0
        };
        this.mensaje = response.msg;
      },
      error => {
        this.mensaje = 'Error al agregar reporte. Por favor, inténtelo de nuevo.';
      }
    );
  }

  editarReporte(reporte: Reporte): void {
    this.reporteEditadoBackup = { ...reporte };
    this.reporteEditado = { ...reporte };
    this.edicionActiva = true;
  }

  cancelarEdicion(): void {
    if (this.reporteEditadoBackup) {
      // Restaurar desde la copia de respaldo
      this.reporteEditado = { ...this.reporteEditadoBackup };
      this.reporteEditadoBackup = null; // Limpiar copia de respaldo
    }
    this.edicionActiva = false; // Desactivar la edición
  }

  actualizarReporte(): void {
    if (this.reporteEditado) {
      const token = localStorage.getItem('token') || '';
      this.reportesService.updateReporte(this.reporteEditado, token).subscribe(
        response => {
          this.loadReportes();
          this.mensaje = response.msg;
          this.edicionActiva = false;
        },
        error => {
          this.mensaje = 'Error al actualizar reporte. Por favor, inténtelo de nuevo.';
          console.log(error);
        }
      );
    }
  }

  eliminarReporte(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.reportesService.deleteReporte(id, token).subscribe(
      response => {
        this.loadReportes();
        this.mensaje = response.msg;
      },
      error => {
        this.mensaje = 'Error al eliminar reporte. Por favor, inténtelo de nuevo.';
      }
    );
  }
}