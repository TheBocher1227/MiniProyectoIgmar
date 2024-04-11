import { Routes, CanActivate } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { AuthGuard } from './authguard.guard';
import { CrudComponent } from './components/users/crud/crud.component';
import { Auth2Guard } from './auth2.guard';
import { VerificacionComponent } from './components/verificacion/verificacion/verificacion.component';
import { RemoveTokenGuard } from './navigation.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'register', loadComponent:()=>import('./components/users/register/register.component').then(m=>m.RegisterComponent)},
    { path: 'login', loadComponent:()=>import('./components/users/login/login.component').then(m=>m.LoginComponent) , canActivate: [RemoveTokenGuard] },
    { path: 'verificacion', loadComponent:()=>import('./components/verificacion/verificacion/verificacion.component').then(m=>m.VerificacionComponent)},
    {
      path: 'index',
      loadComponent: () => import('./components/index/index.component').then(m => m.IndexComponent),
      canActivate: [AuthGuard],data: {role: [1,2,3]},
      children: [
        {
          path: 'crud',
          loadComponent: () => import('./components/users/crud/crud.component').then(m => m.CrudComponent),
          canActivate: [AuthGuard],
          data: {role: [1]}
        },
        {
          path: 'categorias',
          loadComponent: () => import('./components/categorias/categorias.component').then(m => m.CategoriesComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2,3]}
        },
        {
          path: 'dispositivos',
          loadComponent: () => import('./components/devices/devices.component').then(m => m.DevicesComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2,3]}
        },
        {
          path: 'reparaciones',
          loadComponent: () => import('./components/reparaciones/reparaciones.component').then(m => m.ReparacionesComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2,3]}
        },
        {
          path: 'accesorios',
          loadComponent: () => import('./components/accesorios/accesorios.component').then(m => m.AccesoriosComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2,3]}
        },
        {
          path: 'reparaciondispositivos',
          loadComponent: () => import('./components/reparacion-dispositivo/reparacion-dispositivo.component').then(m => m.ReparacionDispositivoComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2]}
        },
        {
          path: 'ordenventa',
          loadComponent: () => import('./components/ordenventa/ordenventa.component').then(m => m.OrdenVentaComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2]}
        },
        {
          path: 'ordenventaa',
          loadComponent: () => import('./components/ordenventa-a/ordenventa-a.component').then(m => m.OrdenventaAccesoriosComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2]}
        },
        {
          path: 'cita',
          loadComponent: () => import('./components/cita/cita.component').then(m => m.CitaComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2]}
        },
        {
          path: 'ingreso',
          loadComponent: () => import('./components/ingresoreparacion/ingresoreparacion.component').then(m => m.IngresoReparacionComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2]}
        },
        {
          path: 'reporte',
          loadComponent: () => import('./components/reporte/reporte.component').then(m => m.ReportesComponent),
          canActivate: [AuthGuard],
          data: {role: [1,2]}
        },
        {
          path: 'logs',
          loadComponent: () => import('./components/log/log.component').then(m => m.LogComponent),
          canActivate: [AuthGuard],
          data: {role: [1]}
        },


      ]
    }    
  ];