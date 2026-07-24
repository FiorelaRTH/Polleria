import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { PromocionesService } from '../../services/promociones.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../interfaces/producto.interface';
import { Promocion } from '../../interfaces/promocion.interface';
import { Configuracion } from '../../interfaces/configuracion.interface';
import { ProductoCardComponent } from '../../components/producto-card/producto-card.component';
import { HeroMarqueeComponent } from '../../components/hero-marquee/hero-marquee.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductoCardComponent, HeroMarqueeComponent, RevealDirective],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  destacados:  Producto[]   = [];
  promociones: Promocion[]  = [];
  config: Configuracion = {
    nombreNegocio:   'Pollería El Chino',
    direccion:       '',
    telefono:        '',
    whatsapp:        '',
    correo:          '',
    horario:         '',
    facebook:        '',
    instagram:       '',
    googleMapsUrl:   '',
    googleMapsEmbed: '',
    logo:            '',
    bannerCarta:     ''
  };

  get imagenesHero(): string[] {
    return this.destacados.map(p => p.imagen);
  }

  get infoRapida() {
    return [
      { icono: 'bi-clock',     texto: this.config.horario   || '—', label: 'Horario'   },
      { icono: 'bi-telephone', texto: this.config.telefono  || '—', label: 'Teléfono'  },
      { icono: 'bi-geo-alt',   texto: this.config.direccion || '—', label: 'Dirección' },
      { icono: 'bi-whatsapp',  texto: this.config.whatsapp  ? '+' + this.config.whatsapp : '—', label: 'WhatsApp' }
    ];
  }

  constructor(
    private router:              Router,
    private productosService:   ProductosService,
    private promocionesService: PromocionesService,
    private configService:      ConfiguracionService,
    private carritoService:     CarritoService
  ) {}

  ngOnInit() {
    this.productosService.getDestacados().subscribe(p => this.destacados = p);
    this.promocionesService.getActivas().subscribe(p  => this.promociones = p.slice(0, 3));
    this.configService.getConfig().subscribe(c        => this.config = c);
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  getWhatsappUrl(): string {
    return this.configService.getWhatsappUrl('Hola, deseo hacer un pedido 🍗');
  }

  irACarta(): void {
    this.router.navigate(['/carta']);
  }

  scrollAProductos(): void {
    const el = document.getElementById('productos-destacados');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}