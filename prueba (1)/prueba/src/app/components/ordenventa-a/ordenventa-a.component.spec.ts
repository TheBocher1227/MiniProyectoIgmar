import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenventaAComponent } from './ordenventa-a.component';

describe('OrdenventaAComponent', () => {
  let component: OrdenventaAComponent;
  let fixture: ComponentFixture<OrdenventaAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenventaAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenventaAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
