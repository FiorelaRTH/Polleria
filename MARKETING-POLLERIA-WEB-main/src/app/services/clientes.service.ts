import { Injectable } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Cliente, ClienteDb } from '../interfaces/cliente.interface';

@Injectable({ providedIn: 'root' })
export class ClientesService {

  constructor(private supa: SupabaseService) {}

  private mapear(db: ClienteDb): Cliente {
    return {
      id:            db.id,
      nombre:        db.nombre,
      correo:        db.correo,
      celular:       db.celular,
      fechaRegistro: db.fecha_registro
    };
  }

  getAll(): Observable<Cliente[]> {
    return from(
      this.supa.client
        .from('clientes')
        .select('*')
        .order('fecha_registro', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ClienteDb[]).map(c => this.mapear(c));
      })
    );
  }

  getUltimos(cantidad: number = 5): Observable<Cliente[]> {
    return from(
      this.supa.client
        .from('clientes')
        .select('*')
        .order('fecha_registro', { ascending: false })
        .limit(cantidad)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ClienteDb[]).map(c => this.mapear(c));
      })
    );
  }

  registrar(cliente: { nombre: string; correo: string; celular: string }): Observable<Cliente> {
    return from(
      this.supa.client
        .from('clientes')
        .insert({
          nombre:  cliente.nombre,
          correo:  cliente.correo,
          celular: cliente.celular
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as ClienteDb);
      })
    );
  }

  buscar(termino: string): Observable<Cliente[]> {
    return from(
      this.supa.client
        .from('clientes')
        .select('*')
        .or(`nombre.ilike.%${termino}%,correo.ilike.%${termino}%,celular.ilike.%${termino}%`)
        .order('fecha_registro', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ClienteDb[]).map(c => this.mapear(c));
      })
    );
  }
}