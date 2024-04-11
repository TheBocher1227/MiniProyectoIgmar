import { TestBed } from '@angular/core/testing';

import { IngresoReparacionService } from './ingreso-reparacion.service';

describe('IngresoReparacionService', () => {
  let service: IngresoReparacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresoReparacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
