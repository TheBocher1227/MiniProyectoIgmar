// components/devices/devices.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from '../../Interfaces/device';
import { DeviceService } from '../../services/device.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceResponse } from '../../Interfaces/device-response';
import { ApiResponse } from '../../Interfaces/api-response';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,ReactiveFormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {
  @ViewChild('updateForm') updateForm: any;
  newDevice: Device = { id: 0, marca: '', modelo: '', tipo_dispositivos: '' };
  devices: Device[] | undefined;
  message: string | null = null;
  messagedeletevalid:String |null=null;
  messagebadmarca:String | null = null;
  messagebadmodelo:String | null = null;
  messagebadtipo_dispositivos:String | null = null;

  messageinvalidmarca:String | null = null;
  messageinvalidmodelo:String | null = null;
  messageinvalidtipo_dispositivos:String | null = null;

  messageupdatevalid :String | null = null;

  rolUsuario: number = 0;
  selectedDevice: Device | null = null;
  tempDevice: Device | null = null;
  registerMessage: string | null = null;
  
  newDeviceForm: FormGroup = new FormGroup({});
  EditForm: FormGroup = new FormGroup({});

  constructor(private deviceService: DeviceService, private authService: AuthService,private FormBuilder: FormBuilder) {
    
  }

  ngOnInit(): void {
    this.loadDevices();
    this.loadUserRole();
    this.newDeviceForm = this.FormBuilder.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      tipo_dispositivos: ['', Validators.required]
    });
    this.EditForm = this.FormBuilder.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      tipo_dispositivos: ['', Validators.required]
    });
  }

  loadDevices(): void {
    const token = localStorage.getItem('token') || '';
    this.deviceService.getDevices(token).subscribe((response: ApiResponse) => {// Añade esta línea
      this.devices = response['data :'];
    });
  }
  
  

  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
      });
    }
  }

  addDevice(newDeviceValue: Device): void {
    const token = localStorage.getItem('token') || '';
    this.deviceService.addDevice(newDeviceValue, token).subscribe(
      response => {
        this.loadDevices();
        this.message = response.msg;
        this.messagebadmarca = null;
        this.messagebadmodelo = null;
        this.messagebadtipo_dispositivos = null;
        this.messageupdatevalid=null;
        this.messagedeletevalid = null;
        this.newDeviceForm.reset();
        
      },
      error => {
        this.messagebadmarca = error.error.data.marca[0];
        this.messagebadmodelo = error.error.data.modelo[0];
        this.messagebadtipo_dispositivos = error.error.data.tipo_dispositivos[0];
        this.messageupdatevalid=null;

      }
    );
  }

  editDevice(device: Device): void {
    if (this.selectedDevice == device) {
      this.selectedDevice = null;
      this.tempDevice = null;
      this.EditForm.reset();
    }
    else {
    this.selectedDevice = device;
    this.tempDevice = { ...device };
    this.message=null;
    this.messagedeletevalid = null;
    this.EditForm.patchValue({
      marca: device.marca,
      modelo: device.modelo,
      tipo_dispositivos: device.tipo_dispositivos
    });
    this.newDeviceForm.reset();
    }
  }

  updateDevice(): void {
    const token = localStorage.getItem('token') || '';
    if (this.tempDevice) {
      this.tempDevice.marca = this.EditForm.get('marca')?.value; // Actualiza el valor de marca con el valor del formulario
      this.tempDevice.modelo = this.EditForm.get('modelo')?.value; // Actualiza el valor de modelo con el valor del formulario
      this.tempDevice.tipo_dispositivos = this.EditForm.get('tipo_dispositivos')?.value; // Actualiza el valor de tipo_dispositivos con el valor del formulario
      this.deviceService.updateDevice(this.tempDevice, token).subscribe(
        response => {
          this.loadDevices();
          this.selectedDevice = null;
          this.tempDevice = null;
          this.messageupdatevalid = response.msg;
          this.limpiarupdate();
          this.messagedeletevalid = null;

          
        },
        error => {
          this.messageinvalidmarca = error.error.data.marca[0];
          this.messageinvalidmodelo = error.error.data.modelo[0];
          this.messageinvalidtipo_dispositivos = error.error.data.tipo_dispositivos[0];
          this.messagedeletevalid = null;
        }
      );
    }
  }

  deleteDevice(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.deviceService.deleteDevice(id, token).subscribe(
      response => {
        this.loadDevices();
        this.message = null;
        this.messagedeletevalid = response.msg;
        this.messageupdatevalid=null;
        this.messageinvalidmarca = null;
    this.messageinvalidmodelo = null;
   this.messageinvalidtipo_dispositivos = null;
       
      },
      error => {
        this.registerMessage = 'Error al eliminar dispositivo. Por favor, inténtelo de nuevo.';
        this.message = error.error.msg;
        this.messageinvalidmarca = null;
    this.messageinvalidmodelo = null;
   this.messageinvalidtipo_dispositivos = null;
        

      }
    );
  }

  cancelEdit(): void {
    this.selectedDevice = null;
    this.tempDevice = null;
    this.messageupdatevalid=null;
    this.messagedeletevalid = null;
  }

  limpiarupdate() :void{
    this.messageinvalidmarca = null;
    this.messageinvalidmodelo = null;
   this.messageinvalidtipo_dispositivos = null;
  }
}
