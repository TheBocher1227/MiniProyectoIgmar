import { TestBed } from '@angular/core/testing';

import { ReparacionService } from './reparacion.service';

describe('ReparacionService', () => {
  let service: ReparacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReparacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
