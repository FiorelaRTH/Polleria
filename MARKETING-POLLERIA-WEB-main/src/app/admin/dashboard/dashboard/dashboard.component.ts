import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../services/productos.service';
import { CategoriasService } from '../../../services/categorias.service';
import { PromocionesService } from '../../../services/promociones.service';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../../interfaces/cliente.interface';
import { Promocion } from '../../../interfaces/promocion.interface';

interface StatCard {
  label:   string;
  valor:   number;
  icon:    string;
  color:   string;
  ruta:    string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  stats:           StatCard[]  = [];
  ultimosClientes: Cliente[]   = [];
  ultimasPromos:   Promocion[] = [];
  hoy = new Date();

  constructor(
    private productosService:   ProductosService,
    private categoriasService:  CategoriasService,
    private promocionesService: PromocionesService,
    private clientesService:    ClientesService
  ) {}

  ngOnInit() {
    this.productosService.getAll().subscribe(productos => {
      const activos   = productos.filter(p => p.disponible).length;
      const inactivos = productos.filter(p => !p.disponible).length;

      this.categoriasService.getAll().subscribe(categorias => {
        this.promocionesService.getAll().subscribe(promociones => {
          this.clientesService.getAll().subscribe(clientes => {

            this.stats = [
              { label: 'Total Productos',   valor: productos.length,   icon: 'bi-egg-fried',    color: 'stat-red',    ruta: '/admin/productos'   },
              { label: 'Productos Activos', valor: activos,            icon: 'bi-check-circle', color: 'stat-green',  ruta: '/admin/productos'   },
              { label: 'Inactivos',         valor: inactivos,          icon: 'bi-x-circle',     color: 'stat-orange', ruta: '/admin/productos'   },
              { label: 'Categorías',        valor: categorias.length,  icon: 'bi-tags',         color: 'stat-blue',   ruta: '/admin/categorias'  },
              { label: 'Promociones',       valor: promociones.length, icon: 'bi-megaphone',    color: 'stat-yellow', ruta: '/admin/promociones' },
              { label: 'Clientes',          valor: clientes.length,    icon: 'bi-people',       color: 'stat-purple', ruta: '/admin/clientes'    },
            ];

            this.ultimosClientes = [...clientes].reverse().slice(0, 5);
            this.ultimasPromos   = promociones.filter(p => p.activa).slice(0, 4);
          });
        });
      });
    });
  }
}