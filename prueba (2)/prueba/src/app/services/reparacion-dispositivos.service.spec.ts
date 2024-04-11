import { TestBed } from '@angular/core/testing';

import { ReparacionDispositivosService } from './reparacion-dispositivos.service';

describe('ReparacionDispositivosService', () => {
  let service: ReparacionDispositivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReparacionDispositivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
