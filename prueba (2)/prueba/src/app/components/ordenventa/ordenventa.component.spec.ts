import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenventaComponent } from './ordenventa.component';

describe('OrdenventaComponent', () => {
  let component: OrdenventaComponent;
  let fixture: ComponentFixture<OrdenventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenventaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
