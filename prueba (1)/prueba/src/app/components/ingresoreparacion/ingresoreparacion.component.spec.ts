import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoreparacionComponent } from './ingresoreparacion.component';

describe('IngresoreparacionComponent', () => {
  let component: IngresoreparacionComponent;
  let fixture: ComponentFixture<IngresoreparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoreparacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresoreparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
