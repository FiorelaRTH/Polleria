import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  exact?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-nav-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-shell.component.html',
  styleUrls: ['./nav-shell.component.scss']
})
export class NavShellComponent implements OnInit {

  cantidadCarrito = 0;

  navItems: NavItem[] = [
    { label: 'Inicio',      icon: 'bi-house-door',     route: '/',           exact: true },
    { label: 'Carta',       icon: 'bi-journal-text',   route: '/carta' },
    { label: 'Promociones', icon: 'bi-tags',           route: '/promociones' },
    { label: 'Contacto',    icon: 'bi-geo-alt',        route: '/contacto' },
    { label: 'Carrito',     icon: 'bi-bag-heart',      action: () => this.abrirCarrito() },
  ];

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.getItems().subscribe(items => {
      this.cantidadCarrito = items.reduce((a, i) => a + i.cantidad, 0);
    });
  }

  abrirCarrito() {
    this.carritoService.abrir();
  }
}
