import { Component, OnInit } from '@angular/core';
import { ApiResponse8, IngresoReparacion, Reporte } from '../../Interfaces/api-response';
import { ReportesService } from '../../services/reportes.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  nuevoReporteForm: FormGroup= new FormGroup({});
  editarReporteForm: FormGroup= new FormGroup({});
  constructor(private AuthService: AuthService,private reportesService: ReportesService, private ingresoReparacionService: IngresoReparacionService, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.loadReportes();
    this.loadIngresos();
    this.loadUserRole();
    this.nuevoReporteForm = this.fb.group({
      precio: ['', [Validators.required, Validators.min(1)]],
      fecha_entrega: ['', Validators.required],
      ingreso: ['', Validators.required]
    });

    this.editarReporteForm = this.fb.group({
      precio: ['', [Validators.required, Validators.min(1)]],
      fecha_entrega: ['', Validators.required],
      ingreso: ['', Validators.required]
    });
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
    this.reportesService.addReporte(this.nuevoReporteForm.value, token).subscribe(
      response => {
        this.loadReportes();
        this.nuevoReporteForm.reset();
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
    this.editarReporteForm.patchValue({
      precio: reporte.precio,
      fecha_entrega: reporte.fecha_entrega,
      ingreso: reporte.ingreso
    });
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
      this.reporteEditado.precio = this.editarReporteForm.get('precio')?.value;
      this.reporteEditado.fecha_entrega = this.editarReporteForm.get('fecha_entrega')?.value;
      this.reporteEditado.ingreso = this.editarReporteForm.get('ingreso')?.value;

      this.reportesService.updateReporte(this.reporteEditado, token).subscribe(
        response => {
          this.loadReportes();
          this.mensaje = response.msg;
          this.edicionActiva = false;
          this.editarReporteForm.reset();
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
    if (this.reporteEditado && this.reporteEditado.id === id) {
      this.edicionActiva = false;
      this.editarReporteForm.reset();
    }
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