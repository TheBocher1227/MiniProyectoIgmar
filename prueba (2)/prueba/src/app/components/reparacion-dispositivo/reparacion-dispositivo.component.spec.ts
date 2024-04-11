import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparacionDispositivoComponent } from './reparacion-dispositivo.component';

describe('ReparacionDispositivoComponent', () => {
  let component: ReparacionDispositivoComponent;
  let fixture: ComponentFixture<ReparacionDispositivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparacionDispositivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReparacionDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
