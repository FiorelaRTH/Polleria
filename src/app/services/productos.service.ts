import { Injectable } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Producto, ProductoDb } from '../interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class ProductosService {

  constructor(private supa: SupabaseService) {}

  private mapear(db: ProductoDb): Producto {
    return {
      id:          db.id,
      nombre:      db.nombre,
      descripcion: db.descripcion,
      precio:      Number(db.precio),
      categoriaId: db.categoria_id ?? '',
      imagen:      db.imagen,
      disponible:  db.disponible,
      destacado:   db.destacado,
      incluye:     db.incluye ?? [],
      creadoEn:    db.creado_en
    };
  }

  getAll(): Observable<Producto[]> {
    return from(
      this.supa.client
        .from('productos')
        .select('*')
        .order('creado_en', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ProductoDb[]).map(p => this.mapear(p));
      })
    );
  }

  getDestacados(): Observable<Producto[]> {
    return from(
      this.supa.client
        .from('productos')
        .select('*')
        .eq('destacado', true)
        .eq('disponible', true)
        .order('creado_en', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ProductoDb[]).map(p => this.mapear(p));
      })
    );
  }

  getDisponibles(): Observable<Producto[]> {
    return from(
      this.supa.client
        .from('productos')
        .select('*')
        .eq('disponible', true)
        .order('creado_en', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ProductoDb[]).map(p => this.mapear(p));
      })
    );
  }

  getByCategoria(categoriaId: string): Observable<Producto[]> {
    return from(
      this.supa.client
        .from('productos')
        .select('*')
        .eq('categoria_id', categoriaId)
        .eq('disponible', true)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as ProductoDb[]).map(p => this.mapear(p));
      })
    );
  }

  add(producto: Omit<Producto, 'id' | 'creadoEn'>): Observable<Producto> {
    return from(
      this.supa.client
        .from('productos')
        .insert({
          nombre:       producto.nombre,
          descripcion:  producto.descripcion,
          precio:       producto.precio,
          categoria_id: producto.categoriaId || null,
          imagen:       producto.imagen,
          disponible:   producto.disponible,
          destacado:    producto.destacado,
          incluye:      producto.incluye
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as ProductoDb);
      })
    );
  }

  update(producto: Producto): Observable<Producto> {
    return from(
      this.supa.client
        .from('productos')
        .update({
          nombre:       producto.nombre,
          descripcion:  producto.descripcion,
          precio:       producto.precio,
          categoria_id: producto.categoriaId || null,
          imagen:       producto.imagen,
          disponible:   producto.disponible,
          destacado:    producto.destacado,
          incluye:      producto.incluye
        })
        .eq('id', producto.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as ProductoDb);
      })
    );
  }

  toggleDisponible(id: string, estadoActual: boolean): Observable<Producto> {
    return from(
      this.supa.client
        .from('productos')
        .update({ disponible: !estadoActual })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as ProductoDb);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supa.client
        .from('productos')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}