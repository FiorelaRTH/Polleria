import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'carta',
    loadComponent: () =>
      import('./pages/carta/carta.component').then(m => m.CartaComponent)
  },
  {
    path: 'promociones',
    loadComponent: () =>
      import('./pages/promociones/promociones.component').then(m => m.PromocionesComponent)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then(m => m.ContactoComponent)
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./admin/login/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./admin/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./admin/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'productos',
            loadComponent: () =>
              import('./admin/productos/productos-lista/productos-lista.component').then(m => m.ProductosListaComponent)
          },
          {
            path: 'categorias',
            loadComponent: () =>
              import('./admin/categorias/categorias-lista/categorias-lista.component').then(m => m.CategoriasListaComponent)
          },
          {
            path: 'promociones',
            loadComponent: () =>
              import('./admin/promociones/promociones-lista/promociones-lista.component').then(m => m.PromocionesListaComponent)
          },
          {
            path: 'clientes',
            loadComponent: () =>
              import('./admin/clientes/clientes/clientes.component').then(m => m.ClientesComponent)
          },
          {
            path: 'configuracion',
            loadComponent: () =>
              import('./admin/configuracion/configuracion/configuracion.component').then(m => m.ConfiguracionComponent)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];