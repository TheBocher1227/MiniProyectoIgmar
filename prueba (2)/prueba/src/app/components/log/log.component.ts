import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit {
  logs: any[] = [];
  dataObjects: any[] = [];
  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.getLogData();
  }

  getLogData(): void {
    this.logService.getLogs()
      .subscribe(logs => {
        this.logs = logs;
        // Extraer objetos de la propiedad "data" y almacenarlos en dataObjects
        this.dataObjects = this.logs.map(log => log.data);
      });
  }
}