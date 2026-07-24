import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { SupabaseService } from '../../../services/supabase.service';
import { Cliente } from '../../../interfaces/cliente.interface';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {

  todos:     Cliente[] = [];
  filtrados: Cliente[] = [];
  busqueda   = '';
  cargando   = true;
  errorMsg   = '';

  private suscripcionRealtime: { unsubscribe: () => void } | null = null;

  constructor(
    private clientesService: ClientesService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.cargar();
    this.suscribirRealtime();
  }

  ngOnDestroy() {
    if (this.suscripcionRealtime) {
      this.suscripcionRealtime.unsubscribe();
    }
  }

  cargar() {
    this.cargando = true;
    this.errorMsg = '';
    this.clientesService.getAll().subscribe({
      next: clientes => {
        this.todos     = clientes;
        this.filtrados = clientes;
        this.cargando  = false;
        if (this.busqueda.trim()) {
          this.onBusqueda();
        }
      },
      error: e => {
        this.errorMsg = 'Error al cargar clientes: ' + e.message;
        this.cargando = false;
      }
    });
  }

  private suscribirRealtime() {
    const canal = this.supabaseService.client
      .channel('clientes-cambios')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'clientes' },
        () => { this.cargar(); }
      )
      .subscribe();

    this.suscripcionRealtime = { unsubscribe: () => canal.unsubscribe() };
  }

  onBusqueda() {
    if (!this.busqueda.trim()) {
      this.filtrados = this.todos;
      return;
    }
    const t = this.busqueda.toLowerCase();
    this.filtrados = this.todos.filter(c =>
      c.nombre.toLowerCase().includes(t) ||
      c.correo.toLowerCase().includes(t) ||
      c.celular.includes(t)
    );
  }

  getInicial(nombre: string): string {
    return nombre.charAt(0).toUpperCase();
  }
}