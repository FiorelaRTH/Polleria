import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrito } from '../interfaces/carrito.interface';
import { Producto } from '../interfaces/producto.interface';
import { ConfiguracionService } from './configuracion.service';

const STORAGE_KEY = 'carrito_elchino';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private items$ = new BehaviorSubject<ItemCarrito[]>(this.cargarDesdeStorage());
  private visible$ = new BehaviorSubject<boolean>(false);

  constructor(private configService: ConfiguracionService) {}

  getItems()   { return this.items$.asObservable(); }
  getVisible() { return this.visible$.asObservable(); }

  abrir()  { this.visible$.next(true); }
  cerrar() { this.visible$.next(false); }
  toggle() { this.visible$.next(!this.visible$.value); }

  agregar(producto: Producto) {
    const items = [...this.items$.value];
    const idx   = items.findIndex(i => i.producto.id === producto.id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], cantidad: items[idx].cantidad + 1 };
    } else {
      items.push({ producto, cantidad: 1 });
    }
    this.emitir(items);
    this.abrir();
  }

  aumentar(productoId: string) {
    const items = this.items$.value.map(i =>
      i.producto.id === productoId ? { ...i, cantidad: i.cantidad + 1 } : i
    );
    this.emitir(items);
  }

  disminuir(productoId: string) {
    const items = this.items$.value
      .map(i => i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i)
      .filter(i => i.cantidad > 0);
    this.emitir(items);
  }

  eliminar(productoId: string) {
    this.emitir(this.items$.value.filter(i => i.producto.id !== productoId));
  }

  vaciar() {
    this.emitir([]);
  }

  getTotal(): number {
    return this.items$.value.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);
  }

  getCantidadTotal(): number {
    return this.items$.value.reduce((acc, i) => acc + i.cantidad, 0);
  }

  generarMensajeWhatsApp(): string {
    const items = this.items$.value;
    if (!items.length) return '';
    const lineas = items.map(i =>
      `${i.cantidad} x ${i.producto.nombre} - S/.${(i.producto.precio * i.cantidad).toFixed(2)}`
    ).join('\n');
    const total = this.getTotal().toFixed(2);
    return `Hola Pollería El Chino 🍗\n\nDeseo realizar el siguiente pedido:\n\n${lineas}\n\n*TOTAL: S/.${total}*\n\nMuchas gracias.`;
  }

  abrirWhatsApp() {
    const mensaje = this.generarMensajeWhatsApp();
    const url     = this.configService.getWhatsappUrl(mensaje);
    window.open(url, '_blank');
  }

  private emitir(items: ItemCarrito[]) {
    this.items$.next(items);
    this.guardarEnStorage(items);
  }

  private guardarEnStorage(items: ItemCarrito[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }

  private cargarDesdeStorage(): ItemCarrito[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }
}