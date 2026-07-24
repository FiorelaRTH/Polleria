import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { CategoriasService } from '../../services/categorias.service';
import { CarritoService } from '../../services/carrito.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Producto } from '../../interfaces/producto.interface';
import { Categoria } from '../../interfaces/categoria.interface';
import { ProductoCardComponent } from '../../components/producto-card/producto-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductoCardComponent, RevealDirective],
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss']
})
export class CartaComponent implements OnInit {

  todos:     Producto[]  = [];
  filtrados: Producto[]  = [];
  categorias:Categoria[] = [];
  categoriaActiva = 'todas';
  busqueda        = '';
  cargando        = true;
  bannerUrl = '';

  constructor(
    private productosService:  ProductosService,
    private categoriasService: CategoriasService,
    private carritoService:    CarritoService,
    private configService:     ConfiguracionService
  ) {}

  ngOnInit() {
    this.productosService.getDisponibles().subscribe(p => {
      this.todos    = p;
      this.filtrados = p;
      this.cargando  = false;
    });
    this.categoriasService.getAll().subscribe(c => this.categorias = c);
    this.configService.getConfig().subscribe(c => this.bannerUrl = c.bannerCarta);
  }

  filtrarPorCategoria(categoriaId: string) {
    this.categoriaActiva = categoriaId;
    this.busqueda = '';
    this.aplicarFiltros();
  }

  onBusqueda() {
    this.categoriaActiva = 'todas';
    this.aplicarFiltros();
  }

  private aplicarFiltros() {
    let r = [...this.todos];
    if (this.categoriaActiva !== 'todas') {
      r = r.filter(p => p.categoriaId === this.categoriaActiva);
    }
    if (this.busqueda.trim()) {
      const t = this.busqueda.toLowerCase();
      r = r.filter(p =>
        p.nombre.toLowerCase().includes(t) ||
        p.descripcion.toLowerCase().includes(t)
      );
    }
    this.filtrados = r;
  }

  limpiarBusqueda() {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  getNombreCategoria(id: string): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '';
  }

  scrollAProductos(): void {
    const el = document.querySelector('.carta-section .row');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}