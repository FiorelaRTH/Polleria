import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmacion.component.html'
})
export class ModalConfirmacionComponent {

  @Input() visible = false;
  @Input() total   = 0;
  @Output() aceptar  = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  constructor(public carritoService: CarritoService) {}

  onAceptar()  { this.aceptar.emit(); }
  onCancelar() { this.cancelar.emit(); }
}