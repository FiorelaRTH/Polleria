import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesService } from '../../../services/promociones.service';
import { Promocion } from '../../../interfaces/promocion.interface';
import { PromocionesFormComponent } from '../promociones-form/promociones-form.component';

@Component({
  selector: 'app-promociones-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, PromocionesFormComponent],
  templateUrl: './promociones-lista.component.html',
  styleUrls: ['./promociones-lista.component.scss']
})
export class PromocionesListaComponent implements OnInit {

  promociones: Promocion[] = [];
  mostrarForm  = false;
  promoEdit:   Promocion | null = null;

  mostrarConfirm    = false;
  promoAEliminar:   Promocion | null = null;

  constructor(private promocionesService: PromocionesService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.promocionesService.getAll().subscribe(p => this.promociones = p);
  }

  nueva() {
    this.promoEdit  = null;
    this.mostrarForm = true;
  }

  editar(p: Promocion) {
    this.promoEdit  = { ...p };
    this.mostrarForm = true;
  }

  confirmarEliminar(p: Promocion) {
    this.promoAEliminar = p;
    this.mostrarConfirm = true;
  }

  eliminar() {
    if (this.promoAEliminar) {
      this.promocionesService.delete(this.promoAEliminar.id);
      this.mostrarConfirm = false;
      this.promoAEliminar = null;
      this.cargar();
    }
  }

  cancelarEliminar() {
    this.mostrarConfirm = false;
    this.promoAEliminar = null;
  }

  onFormGuardado() {
    this.mostrarForm = false;
    this.cargar();
  }

  onFormCancelado() {
    this.mostrarForm = false;
  }
}