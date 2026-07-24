import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../interfaces/carrito.interface';
import { ModalConfirmacionComponent } from '../../components/modal-confirmacion/modal-confirmacion.component';
import { FormularioPromocionalComponent } from '../../components/formulario-promocional/formulario-promocional.component';

@Component({
  selector: 'app-carrito-sidebar',
  standalone: true,
  imports: [CommonModule, ModalConfirmacionComponent, FormularioPromocionalComponent],
  templateUrl: './carrito-sidebar.component.html',
  styleUrls: ['./carrito-sidebar.component.scss']
})
export class CarritoSidebarComponent implements OnInit {

  items: ItemCarrito[] = [];
  visible = false;
  total = 0;
  mostrarModal = false;
  mostrarFormulario = false;
  pedidoConfirmado = false;

  constructor(public carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.getItems().subscribe(items => {
      this.items    = items;
      this.total    = this.carritoService.getTotal();
    });
    this.carritoService.getVisible().subscribe(v => this.visible = v);
  }

  cerrar() {
    this.carritoService.cerrar();
  }

  aumentar(id: string) {
    this.carritoService.aumentar(id);
  }

  disminuir(id: string) {
    this.carritoService.disminuir(id);
  }

  eliminar(id: string) {
    this.carritoService.eliminar(id);
  }

  confirmarPedido() {
    if (!this.items.length) return;
    this.mostrarModal = true;
  }

  onModalAceptar() {
    this.mostrarModal = false;
    this.carritoService.abrirWhatsApp();
    this.pedidoConfirmado = true;
    this.mostrarFormulario = true;
  }

  onModalCancelar() {
    this.mostrarModal = false;
  }

  onFormularioGuardado() {
    this.mostrarFormulario = false;
    this.carritoService.vaciar();
    this.carritoService.cerrar();
    this.pedidoConfirmado = false;
  }

  onFormularioOmitido() {
    this.mostrarFormulario = false;
    this.carritoService.vaciar();
    this.carritoService.cerrar();
    this.pedidoConfirmado = false;
  }
}