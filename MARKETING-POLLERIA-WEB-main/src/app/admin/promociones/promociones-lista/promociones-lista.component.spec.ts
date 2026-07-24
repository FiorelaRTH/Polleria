import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesListaComponent } from './promociones-lista.component';

describe('PromocionesListaComponent', () => {
  let component: PromocionesListaComponent;
  let fixture: ComponentFixture<PromocionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
