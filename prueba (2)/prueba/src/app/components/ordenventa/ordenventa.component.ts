import { Component, OnInit } from '@angular/core';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { ApiResponse5, OrdenVenta } from '../../Interfaces/api-response';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../Interfaces/user-interface';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-ordenventa',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ordenventa.component.html',
  styleUrl: './ordenventa.component.css'
})
export class OrdenVentaComponent implements OnInit {

  ordenesVenta: OrdenVenta[] = [];
  nuevaOrden: OrdenVenta = { id: 0, fecha_orden: new Date(), estado: '', user: 0, tipo_venta: '' };
  mensaje: string | null = null;
  ordenEditada: OrdenVenta | null = null;
  users: User[] | undefined;
  rolUsuario: number = 0;
  nuevoOrdenForm: FormGroup= new FormGroup({});
  editarOrdenForm: FormGroup = new FormGroup({});

  constructor(private AuthService: AuthService,private ordenVentaService: OrdenVentaService, private userService: UsersService,  private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarOrdenesVenta();
    this.loadUsers();
    this.loadUserRole();
    this.nuevoOrdenForm = this.fb.group({
      fechaOrden: ['', Validators.required],
      estado: ['', Validators.required],
      user: ['', Validators.required],
      tipoVenta: ['', Validators.required]
    });
    this.editarOrdenForm = this.fb.group({
      fechaOrden: ['', Validators.required],
      estado: ['', Validators.required],
      user: ['', Validators.required],
      tipoVenta: ['', Validators.required]
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(response => {
      this.users = response['data: '];
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

  getUserName(id: number): string {
    const User = this.users?.find(User => User.id === id);
    return User ? User.name : '';
  }
  

  cargarOrdenesVenta(): void {
    const token = localStorage.getItem('token') || '';
    this.ordenVentaService.getOrdenesVenta(token).subscribe((response: ApiResponse5) => {
      this.ordenesVenta = response['data :'] || [];
      console.log(response);
    });
  }

  agregarOrdenVenta(): void {
    const token = localStorage.getItem('token') || '';
    this.nuevaOrden.fecha_orden = this.nuevoOrdenForm.get('fechaOrden')?.value;
    this.nuevaOrden.estado = this.nuevoOrdenForm.get('estado')?.value;
    this.nuevaOrden.user = this.nuevoOrdenForm.get('user')?.value;
    this.nuevaOrden.tipo_venta = this.nuevoOrdenForm.get('tipoVenta')?.value;
    this.ordenVentaService.addOrdenVenta(this.nuevaOrden, token).subscribe(
      response => {
        this.cargarOrdenesVenta();
        this.mensaje = response.msg;
        // Limpiar campos u otro manejo necesario
        this.nuevaOrden = { id: 0, fecha_orden: new Date(), estado: '', user: 0, tipo_venta: '' };
        this.nuevoOrdenForm.reset();
      },
      error => {
        console.log(error)
        this.mensaje = 'Error al agregar orden de venta. Por favor, inténtelo de nuevo.';
      }
    );
  }

  editarOrdenVenta(ordenVenta: OrdenVenta): void {
    this.ordenEditada = { ...ordenVenta };
    this.editarOrdenForm.patchValue({
      fechaOrden: ordenVenta.fecha_orden,
      estado: ordenVenta.estado,
      user: ordenVenta.user,
      tipoVenta: ordenVenta.tipo_venta
    });
    this.nuevoOrdenForm.reset();
  }

  actualizarOrdenVenta(): void {
    if (this.ordenEditada) {
      const token = localStorage.getItem('token') || '';
      this.ordenEditada.fecha_orden = this.editarOrdenForm.get('fechaOrden')?.value;
    this.ordenEditada.estado = this.editarOrdenForm.get('estado')?.value;
    this.ordenEditada.user = this.editarOrdenForm.get('user')?.value;
    this.ordenEditada.tipo_venta = this.editarOrdenForm.get('tipoVenta')?.value;
      this.ordenVentaService.updateordenventa( this.ordenEditada, token).subscribe(
        response => {
          this.cargarOrdenesVenta();
          this.ordenEditada = null;
          this.mensaje = response.msg;
          
        },
        error => {
          this.mensaje = 'Error al actualizar orden de venta. Por favor, inténtelo de nuevo.';
        }
      );
    }
  }

  eliminarOrdenVenta(id: number): void {
    const token = localStorage.getItem('token') || '';

    if (this.ordenEditada && this.ordenEditada.id === id) {
      this.ordenEditada = null; // Ocultar el formulario de edición
    }
    this.ordenVentaService.deleteordenventa(id , token).subscribe(
      response => {
        this.cargarOrdenesVenta();
        this.mensaje = response.msg;
      },
      error => {
        this.mensaje = 'Error al eliminar orden de venta. Por favor, inténtelo de nuevo.';
      }
    );
  }

  cancelarEdicion(): void {
    this.ordenEditada = null;
  }
}
