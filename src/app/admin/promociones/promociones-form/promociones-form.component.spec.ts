import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesFormComponent } from './promociones-form.component';

describe('PromocionesFormComponent', () => {
  let component: PromocionesFormComponent;
  let fixture: ComponentFixture<PromocionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
