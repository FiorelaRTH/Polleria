import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfiguracionService } from '../../../services/configuracion.service';
import { Configuracion } from '../../../interfaces/configuracion.interface';

interface NavItem {
  label: string;
  icon:  string;
  ruta:  string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  sidebarAbierto   = true;
  menuMovilAbierto = false;

  configuracion: Configuracion = {
    nombreNegocio:'',
    direccion:'',
    telefono:'',
    whatsapp:'',
    correo:'',
    horario:'',
    facebook:'',
    instagram:'',
    googleMapsUrl:'',
    googleMapsEmbed:'',
    logo:'',
    bannerCarta:''
  };

  navItems: NavItem[] = [
    { label: 'Dashboard',     icon: 'bi-grid-1x2',  ruta: '/admin/dashboard'     },
    { label: 'Productos',     icon: 'bi-egg-fried',  ruta: '/admin/productos'     },
    { label: 'Categorías',    icon: 'bi-tags',       ruta: '/admin/categorias'    },
    { label: 'Promociones',   icon: 'bi-megaphone',  ruta: '/admin/promociones'   },
    { label: 'Clientes',      icon: 'bi-people',     ruta: '/admin/clientes'      },
    { label: 'Configuración', icon: 'bi-gear',       ruta: '/admin/configuracion' },
  ];

  adminEmail = '';

  constructor(
    private auth:        AuthService,
    private router:      Router,
    private configSvc:   ConfiguracionService
  ) {}

  ngOnInit() {
    this.adminEmail = this.auth.getEmail();

    this.configSvc.getConfig().subscribe(c => {
      this.configuracion = c;
    });

    if (window.innerWidth < 992) {
      this.sidebarAbierto = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 992) {
      this.menuMovilAbierto = false;
    }
  }

  toggleSidebar()    { this.sidebarAbierto = !this.sidebarAbierto; }
  toggleMenuMovil()  { this.menuMovilAbierto = !this.menuMovilAbierto; }
  cerrarMenuMovil()  { this.menuMovilAbierto = false; }

  logout() { this.auth.logout(); }
}