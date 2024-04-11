import { TestBed } from '@angular/core/testing';

import { OrdenVentaService } from './orden-venta.service';

describe('OrdenVentaService', () => {
  let service: OrdenVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
