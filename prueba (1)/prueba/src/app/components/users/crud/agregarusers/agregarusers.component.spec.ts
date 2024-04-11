import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarusersComponent } from './agregarusers.component';

describe('AgregarusersComponent', () => {
  let component: AgregarusersComponent;
  let fixture: ComponentFixture<AgregarusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarusersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
