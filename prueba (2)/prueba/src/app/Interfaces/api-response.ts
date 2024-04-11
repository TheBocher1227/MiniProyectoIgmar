
import { Time } from "@angular/common";
import { Accesorio } from "./accesorio";
import { Device } from "./device";
import { Reparacion } from "./reparacion";
export interface ApiResponse {
  Msg: string;
  'data :': Device[];
}

export interface ApiResponse2 {
  Msg: string;
  'data :': Reparacion[]; // Aquí deberías tener el arreglo de reparaciones
}

export interface ApiResponse3 {
  Msg: string;
  'data :': Accesorio[]; // Aquí deberías tener el arreglo de reparaciones
}

// reparacion-dispositivo.ts
export interface ReparacionDispositivo {
  id: number;
  dispositivo_id: number;
  reparaciones_id: number;
  precio: string;
}

// api-response.ts
export interface ApiResponse4 {
  Msg: string;
  "data :"?: ReparacionDispositivo[];
}

export interface OrdenVenta {
  id: number;
  fecha_orden: Date;
  estado: string;
  user: number;
  tipo_venta: string;
}

export interface ApiResponse5 {
  Msg: string;
  "data :"?: OrdenVenta[];
}


export interface OrdenVentaAccesorios {
  id: number;
  orden_venta: number;
  accesorio: number;
  cantidad: number;
}

export interface ApiResponse6 {
  Msg: string;
  "data :"?: OrdenVentaAccesorios[];
}

export interface Cita {	
  id : number;
  fecha_cita : Date;
  motivo_cita: string;
  estado_cita: string;
  dispositivo: string;
  usuario: number; 
    // Otras propiedades...
  hora_cita: string;
  
  
}

export interface ApiResponse7 {
  Msg: string;
  "data :"?: Cita[];
}

export interface IngresoReparacion {
  id: number;
  user: number;
  dispositivo: number;
  reparacion: number;
  descripcion: string;
  fecha_ingreso: Date;
  estatus: string;
}

export interface ApiResponse8 {
  Msg: string;
  "data :"?: IngresoReparacion[];
}

export interface Reporte {
  id: number;
  precio: number;
  fecha_entrega: Date;
  ingreso: number;
}

export interface ApiResponse9 {
  Msg: string;
  "data :"?: Reporte[];
}