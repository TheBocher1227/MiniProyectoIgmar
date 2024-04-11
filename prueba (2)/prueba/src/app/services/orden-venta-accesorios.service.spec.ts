import { TestBed } from '@angular/core/testing';

import { OrdenVentaAccesoriosService } from './orden-venta-accesorios.service';

describe('OrdenVentaAccesoriosService', () => {
  let service: OrdenVentaAccesoriosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenVentaAccesoriosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
