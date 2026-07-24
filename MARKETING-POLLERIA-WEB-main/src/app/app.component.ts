import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CarritoSidebarComponent } from './shared/carrito-sidebar/carrito-sidebar.component';
import { ConfiguracionService } from './services/configuracion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CarritoSidebarComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <app-carrito-sidebar></app-carrito-sidebar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <a [href]="whatsappUrl" target="_blank" class="whatsapp-float" title="Escríbenos por WhatsApp">
      <i class="bi bi-whatsapp"></i>
    </a>
  `
})
export class AppComponent implements OnInit {

  whatsappUrl = 'https://wa.me/51999999999';

  constructor(
    private configService: ConfiguracionService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.configService.getConfig().subscribe(c => {
      if (c.whatsapp) {
        this.whatsappUrl = `https://wa.me/${c.whatsapp}`;
      }
    });
  }
}