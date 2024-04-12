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
import { SseService } from '../../services/sse.service';
import { NgZone } from '@angular/core';

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
  previousMessage: Category | null = null;
  
  categoriaform = this.fb.group({
    tipo_categoria: ['', Validators.required],
  });

  updateForm: FormGroup = new FormGroup({});
  constructor(private ngzone: NgZone,private formBuilder: FormBuilder,private fb: FormBuilder,private categoryService: CategoryService, private AuthService: AuthService,private sseService: SseService ) {}
  
  eventSource: EventSource | null = null;
  ngOnInit(): void {
    this.loadCategories();
    this.loadUserRole();
    this.updateForm = this.formBuilder.group({
      tipo_categoria: ['', Validators.required]
    });
    this.updateForm.patchValue({ tipo_categoria: '' });
    this.startSSE();
       


    
  }

  ngOnDestroy() {
    if (this.eventSource) {
      this.eventSource.close(); // Cerrar la conexión SSE al destruir el componente
    }
  }
  
  startSSE(): void{
    
    const eventSource = new EventSource('http://192.168.116.175:8000/api/sse');

    eventSource.onmessage = (event) => {
      console.log(event.data);
      
      if(event.data == "true") {
        console.log('Se ha actualizado la tabla')
        this.sseMessage='Se ha actualizado la tabla';
        

        this.ngzone.run(() => {
          this.loadCategories();
          setTimeout(() => {
          this.sseMessage = '';
        }, 3000);
        });
        //eventSource.close()
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
    if (this.selectedCategory === category) {
        this.selectedCategory = null;
        this.tempCategory = null;
        this.updateForm.reset();
    } else {
        this.selectedCategory = category;
        this.tempCategory = { ...category };
        this.message = null;
        this.messageupdatevalid = null;
        this.messageupdateinvalid = null;
        this.messagebad = null;
        this.messagedeleteinvalid = null;
        this.messagedeletevalid = null;
        this.updateForm.patchValue({ tipo_categoria: category.tipo_categoria });
    }
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





