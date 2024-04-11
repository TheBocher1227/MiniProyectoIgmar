import { Component, OnInit } from '@angular/core';
import { Accesorio } from '../../Interfaces/accesorio';
import { AccesorioService } from '../../services/categorias.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private accesorioService: AccesorioService, private authService: AuthService,  private CategoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadAccesorios();
    this.loadUserRole();
    this.loadCategories();
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
  }

  updateAccesorio(): void {
    const token = localStorage.getItem('token') || '';
    if (this.tempAccesorio) {
      this.accesorioService.updateAccesorio(this.tempAccesorio, token).subscribe(
        response => {
          this.loadAccesorios();
          this.selectedAccesorio = null;
          this.tempAccesorio = null;
          this.registerMessage = response.msg;
          this.message = response.msg;
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
