import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NavShellComponent } from './shared/nav-shell/nav-shell.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CarritoSidebarComponent } from './shared/carrito-sidebar/carrito-sidebar.component';
import { ConfiguracionService } from './services/configuracion.service';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NavShellComponent, FooterComponent, CarritoSidebarComponent, CommonModule],
  template: `
    @if (!esAdminRuta) {
      <app-navbar></app-navbar>
      <app-nav-shell></app-nav-shell>
    }
    <app-carrito-sidebar></app-carrito-sidebar>
    <main>
      <router-outlet></router-outlet>
    </main>
    @if (!esAdminRuta) {
      <app-footer></app-footer>
      @if (!carritoVisible) {
        <a [href]="whatsappUrl" target="_blank" class="whatsapp-float" title="Escríbenos por WhatsApp">
          <i class="bi bi-whatsapp"></i>
        </a>
      }
    }
  `
})
export class AppComponent implements OnInit {

  whatsappUrl = 'https://wa.me/51999999999';
  carritoVisible = false;
  esAdminRuta = false;

  constructor(
    private configService: ConfiguracionService,
    private carritoService: CarritoService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      window.scrollTo(0, 0);
      this.esAdminRuta = event.urlAfterRedirects.startsWith('/admin');
    });
  }

  ngOnInit() {
    this.configService.getConfig().subscribe(c => {
      if (c.whatsapp) {
        this.whatsappUrl = `https://wa.me/${c.whatsapp}`;
      }
    });
    this.carritoService.getVisible().subscribe(v => this.carritoVisible = v);
  }
}