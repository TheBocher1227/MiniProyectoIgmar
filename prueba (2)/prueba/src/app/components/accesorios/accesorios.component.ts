import { Component, OnInit } from '@angular/core';
import { Accesorio } from '../../Interfaces/accesorio';
import { AccesorioService } from '../../services/categorias.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { Category } from '../../Interfaces/category';
import { CategoryService } from '../../services/category.service';
import { ApiResponse } from '../../Interfaces/api-response';
import { ServerResponse } from '../../Interfaces/server-respone';
@Component({
  selector: 'app-accesorios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule],
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.css']
})
export class AccesoriosComponent implements OnInit {
  newAccesorio: Accesorio = { id: 0, nombre: '', descripcion: '', precio: 0, cantidad: 0, categoria: '' };
  accesorios: Accesorio[] | undefined;
  categories: Category[] | undefined;
  message: string | null = null;
  rolUsuario: number = 0;
  selectedAccesorio: Accesorio | null = null;
  tempAccesorio: Accesorio | null = null;
  registerMessage: string | null = null;
  newAccesorioForm: FormGroup = new FormGroup({});
  editAccesorioForm: FormGroup = new FormGroup({});
  constructor(private accesorioService: AccesorioService, private authService: AuthService,  private CategoryService: CategoryService,  private fb: FormBuilder) {
    
  }

  ngOnInit(): void {
    this.loadAccesorios();
    this.loadUserRole();
    this.loadCategories();
    this.newAccesorioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, Validators.required],
      cantidad: [0, Validators.required],
      categoria: ['', Validators.required]
    });
    
    this.editAccesorioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, Validators.required],
      cantidad: [0, Validators.required],
      categoria: ['', Validators.required]
    });
  }

  loadAccesorios(): void {
    const token = localStorage.getItem('token') || '';
    this.accesorioService.getAccesorios(token).subscribe(response => {
      this.accesorios = response['data :'];
    });
    
  }

  

  loadCategories(): void {
    const token = localStorage.getItem('token') || '';
    this.CategoryService.getCategories(token).subscribe((categories: ServerResponse) => {
      this.categories = categories['data :'];
    });
  }

  getCategoriaName(id: number): string {
    const categoria = this.categories?.find(categoria => categoria.id === id);
    return categoria ? categoria.tipo_categoria : '';
  }
  

  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
      });
    }
  }

  addAccesorio(newAccesorio: Accesorio): void {
    const token = localStorage.getItem('token') || '';
    this.accesorioService.addAccesorio(newAccesorio, token).subscribe(
      response => {
        this.loadAccesorios();
        this.registerMessage = response.msg;
        this.message = response.msg;
        console.log(response);
        this.selectedAccesorio = null;
        this.tempAccesorio = null;
        this.newAccesorioForm.reset();
        this.newAccesorio= { id: 0, nombre: '', descripcion: '', precio: 0, cantidad: 0, categoria: '' };
      },
      error => {
        this.registerMessage = 'Error al agregar accesorio. Por favor, inténtelo de nuevo.';
        this.message = error.error.msg;
        console.error(error);
      }
    );
  }

  editAccesorio(accesorio: Accesorio): void {
    this.selectedAccesorio = accesorio;
    this.tempAccesorio = { ...accesorio };
    this.message=null;
    
    this.editAccesorioForm.patchValue({
      nombre: accesorio.nombre,
      descripcion: accesorio.descripcion,
      precio: accesorio.precio,
      cantidad: accesorio.cantidad,
      categoria: accesorio.categoria
    });
    this.newAccesorioForm.reset();
  }

  updateAccesorio(): void {
    const token = localStorage.getItem('token') || '';
    if (this.tempAccesorio) {
      this.tempAccesorio.nombre = this.editAccesorioForm.value.nombre;
      this.tempAccesorio.descripcion = this.editAccesorioForm.value.descripcion;
      this.tempAccesorio.precio = this.editAccesorioForm.value.precio;
      this.tempAccesorio.cantidad = this.editAccesorioForm.value.cantidad;
      this.tempAccesorio.categoria = this.editAccesorioForm.value.categoria;
      this.accesorioService.updateAccesorio(this.tempAccesorio, token).subscribe(
        response => {
          this.loadAccesorios();
          this.selectedAccesorio = null;
          this.tempAccesorio = null;
          this.registerMessage = response.msg;
          this.message = response.msg;
          this.editAccesorioForm.reset();
        },
        error => {
          this.registerMessage = 'Error al actualizar accesorio. Por favor, inténtelo de nuevo.';
          this.message = error.error.msg;
        }
      );
    }
  }

  deleteAccesorio(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.accesorioService.deleteAccesorio(id, token).subscribe(
      response => {
        this.loadAccesorios();
        this.registerMessage = response.msg;
        this.message = response.msg;
        this.message = "Dispositivo eliminado correctamente";
      },
      error => {
        this.registerMessage = 'Error al eliminar accesorio. Por favor, inténtelo de nuevo.';
        this.message = error.error.msg;
      }
    );
  }

  cancelEdit(): void {
    this.selectedAccesorio = null;
    this.tempAccesorio = null;
  }
}
