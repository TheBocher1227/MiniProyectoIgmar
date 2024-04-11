import { Component, OnInit , OnDestroy} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../Interfaces/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ServerResponse } from '../../Interfaces/server-respone';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriesComponent implements OnInit {
  
  newCategory: Category = { id: 0, tipo_categoria: '' };
  categories: Category[] | undefined;
  message: string | null = null;
  messagesse: string | null = null;
  messagebad:string | null = null;
  messageupdatevalid: String | null = null;
  messagedeleteinvalid: String | null = null;
  messagedeletevalid: String | null =null;
  messageupdateinvalid: String | null = null;
  rolUsuario: number = 0;
  selectedCategory: Category | null = null;
  tempCategory: Category | null = null;  
  registerMessage: string | null = null;  
  sseMessage: string = '';
  previousMessage: string = '';

  categoriaform = this.fb.group({
    tipo_categoria: ['', Validators.required],
  });

  updateForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder,private fb: FormBuilder,private categoryService: CategoryService, private AuthService: AuthService ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserRole();
    this.updateForm = this.formBuilder.group({
      tipo_categoria: ['', Validators.required]
    });
    this.updateForm.patchValue({ tipo_categoria: '' });
    const eventSource = new EventSource('http://127.0.0.1:8000/api/auth/sse');
    eventSource.onmessage = event => {
      try {
        const message = JSON.parse(event.data);

        if (message !== this.previousMessage) {
          this.sseMessage = "Nueva categoria agregada";
          this.previousMessage = message;
          this.loadCategories();
          console.log(message);
          setTimeout(() => {
            this.sseMessage = ''; // Oculta el mensaje después de 3 segundos
          }, 1000);
        }
        
      } catch (error) {
        console.error('Error al analizar el mensaje SSE:', error);
      }
    };        


    
  }
  
  
  
  loadCategories(): void {
    const token = localStorage.getItem('token') || '';
    this.categoryService.getCategories(token).subscribe((categories: ServerResponse) => {
      this.categories = categories['data :'];
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
  
  

  addCategory(newCategoryValue: any): void {
    const token = localStorage.getItem('token') || '';
    const newCategory: Category = { id: 0, tipo_categoria: newCategoryValue };
    this.categoryService.addCategory(newCategory, token).subscribe(
      response => {
        
        this.loadCategories();
        this.registerMessage = response.msg;  
        this.message = response.msg;
        this.newCategory = { id: 0, tipo_categoria: "" };
        this.messagebad=null;

        
        this.messageupdatevalid = null;
        this.messagedeletevalid=null;
        this.messageupdateinvalid = null;
        this.messagedeletevalid = response.msg; 
        this.categoriaform.reset();
      },
      error => {
        this.registerMessage = 'Error al actualizar categoría. Por favor, inténtelo de nuevo.';
        this.messageupdateinvalid = error.error.data?.tipo_categoria[0]; // Agregar una verificación para asegurarte de que error.error.data no sea undefined
        console.log(error);
      }
    );
  }
  
  

  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.tempCategory = { ...category };
    this.message =null;
    this.messageupdatevalid = null;
    this.messageupdateinvalid = null;
    this.messagebad=null;
    this.messagedeleteinvalid = null;
    this.messagedeletevalid=null;
    this.updateForm.patchValue({ tipo_categoria: category.tipo_categoria }); // Llenar el formulario con la categoría seleccionada
  }
  
  updateCategory(): void {
    const token = localStorage.getItem('token') || '';
    if (this.tempCategory) {
      this.tempCategory.tipo_categoria = this.updateForm.get('tipo_categoria')?.value;
      this.categoryService.updateCategory(this.tempCategory, token).subscribe(
        response => {
          console.log(this.tempCategory, response);
          this.registerMessage = response.msg;
          this.messageupdatevalid = response.msg;
          this.messageupdateinvalid=null;
          this.loadCategories();
          this.clear();
          this.updateForm.reset();// Limpiar el formulario
        },
        error => {
          this.registerMessage = 'Error al actualizar categoría. Por favor, inténtelo de nuevo.';
          this.messageupdateinvalid= error.error.data.tipo_categoria[0]; 
          console.log(error);
        }
      );
    }
  }
  

  deleteCategory(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.categoryService.deleteCategory(id, token).subscribe(
      response => {
        
        this.registerMessage = response.msg; 
        this.messagedeletevalid = response.msg;
        this.messageupdatevalid = null;
        this.message=null;
        this.messageupdateinvalid = null;
        this.messageupdatevalid = null; 
        this.messagebad=null;
        
        this.loadCategories();
      },
      error => {
        this.registerMessage = 'Error al eliminar categoría. Por favor, inténtelo de nuevo.';
        this.messagedeleteinvalid = error.error.msg; 
        this.messageupdateinvalid = null;
        this.messageupdatevalid = null;
        this.messagedeletevalid = null; 
        this.messagebad=null;
        this.message=null;

      }
    );
  }

  cancelEdit(): void {
    this.selectedCategory = null;
    this.tempCategory = null;
    this.messageupdateinvalid=null; 
    this.messageupdatevalid = null;

   
  }
  

  clear(): void{
    this.selectedCategory = null;
    this.tempCategory = null; 
   
    
  }

  
  
  
}





