import { Component, OnInit } from '@angular/core';
import { OrdenVentaAService } from '../../services/orden-venta-accesorios.service';
import { ApiResponse5, ApiResponse6, OrdenVentaAccesorios } from '../../Interfaces/api-response';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdenVenta } from '../../Interfaces/api-response';
import { Accesorio } from '../../Interfaces/accesorio';
import { AccesorioService } from '../../services/categorias.service';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-ordenventa-a',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ordenventa-a.component.html',
  styleUrl: './ordenventa-a.component.css'
})
export class OrdenventaAccesoriosComponent implements OnInit {
  ordenesVentaA: OrdenVentaAccesorios[] = [];
  accesorios: Accesorio[] = [];
  ordenesVenta: OrdenVenta[] = [];
  users: any[] = []; // Debes ajustar este tipo según la interfaz de usuario real que tengas

  ordenEditada: OrdenVentaAccesorios | null = null;
  nuevaOrden: OrdenVentaAccesorios = { id: 0, orden_venta: 0, accesorio: 0, cantidad: 0 }; // Ajusta según tu interfaz
  rolUsuario: number = 0;
  mensaje: string | null = null;

  nuevoOrdenForm: FormGroup = new FormGroup({});
  editarOrdenForm: FormGroup = new FormGroup({});

  constructor(
    private ordenVentaAService: OrdenVentaAService,
    private accesorioService: AccesorioService,
    private ordenVentaService: OrdenVentaService,
    private AuthService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarOrdenesVenta();
    this.cargarAccesorios();
    this.cargarOrdenesVenta();
    this.cargarOrdenesVentaA();
    this.loadUserRole();
    this.nuevoOrdenForm = this.fb.group({
      orden_venta: ['', Validators.required],
      accesorio: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });

    this.editarOrdenForm = this.fb.group({
      orden_venta: ['', Validators.required],
      accesorio: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
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
  cargarOrdenesVenta(): void {
    const token = localStorage.getItem('token') || '';
    this.ordenVentaService.getOrdenesVenta(token).subscribe((response: ApiResponse5) => {
      this.ordenesVenta = response['data :'] || [];
    });
  }

  cargarOrdenesVentaA(): void {
    const token = localStorage.getItem('token') || '';
    this.ordenVentaAService.getOrdenesVentaA(token).subscribe((response: ApiResponse6) => {
      this.ordenesVentaA = response['data :'] || [];
    });
  }

  cargarAccesorios(): void {
    const token = localStorage.getItem('token') || '';
    this.accesorioService.getAccesorios(token).subscribe(response => {
      this.accesorios = response['data :'];
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : '';
  }


  
  

  getAccesorioName(id: number): string {
    const accesorio = this.accesorios.find(a => a.id === id);
    return accesorio ? accesorio.nombre : '';
  }

  editarOrdenVenta(ordenVenta: OrdenVentaAccesorios): void {
    this.ordenEditada = { ...ordenVenta }; // Crear una copia de respaldo
    this.editarOrdenForm.patchValue({
      orden_venta: ordenVenta.orden_venta,
      accesorio: ordenVenta.accesorio,
      cantidad: ordenVenta.cantidad
    });// Crear una copia de respaldo
    this.mensaje = null;
  }
  

  cancelarEdicion(): void {
    if (this.ordenEditada) {
      this.ordenEditada = { ...this.ordenEditada }; // Restaurar desde la copia de respaldo
      this.ordenEditada = null;
      this.editarOrdenForm.reset(); // Limpiar la copia de respaldo
    } else {
      this.ordenEditada = null;
    }
  }
  

  actualizarOrdenVenta(): void {
    if (this.ordenEditada) {
      const token = localStorage.getItem('token') || '';
      this.ordenEditada.accesorio = this.editarOrdenForm.get('accesorio')?.value;
      this.ordenEditada.orden_venta = this.editarOrdenForm.get('orden_venta')?.value;
      this.ordenEditada.cantidad = this.editarOrdenForm.get('cantidad')?.value;
      this.ordenVentaAService.updateordenventaA(this.ordenEditada, token).subscribe(
        response => {
          this.cargarOrdenesVentaA();
          this.ordenEditada = null;
          this.mensaje = response.msg;
        },
        error => {
          this.mensaje = 'Error al actualizar orden de venta de accesorios. Por favor, inténtelo de nuevo.';
        }
      );
    }
  }

  agregarOrdenVenta(): void {
    const token = localStorage.getItem('token') || '';
    
    this.ordenVentaAService.addOrdenVentaA(this.nuevoOrdenForm.value, token).subscribe(
      response => {
        this.cargarOrdenesVentaA();
        this.nuevaOrden = { id: 0, orden_venta: 0, accesorio: 0, cantidad: 0 };
        this.mensaje = response.msg;
        this.nuevoOrdenForm.reset();
      },
      error => {
        this.mensaje = error.msg;
        console.log(error);
      }
    );
  }

  eliminarOrdenVenta(id: number): void {
    const token = localStorage.getItem('token') || '';
    if (this.ordenEditada && this.ordenEditada.id === id) {
      this.ordenEditada = null; // Ocultar el formulario de edición si se está eliminando la orden editada
    }
    this.ordenVentaAService.deleteordenventaA(id, token).subscribe(
      response => {
        this.cargarOrdenesVentaA();
        this.mensaje = "Se elimino el registro";
      },
      error => {
        this.mensaje = error.message;
      }
    );
  }
}