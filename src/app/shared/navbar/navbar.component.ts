import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Configuracion } from '../../interfaces/configuracion.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  configuracion: Configuracion = {
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

  cantidadCarrito = 0;
  scrolled        = false;

  constructor(
    private carritoService: CarritoService,
    private configService:  ConfiguracionService
  ) {}

  ngOnInit() {
    this.configService.getConfig().subscribe(c => {
      this.configuracion = c;
    });

    this.carritoService.getItems().subscribe(items => {
      this.cantidadCarrito = items.reduce((a, i) => a + i.cantidad, 0);
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  abrirCarrito() {
    this.carritoService.abrir();
  }
}