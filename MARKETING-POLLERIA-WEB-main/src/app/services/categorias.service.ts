import { Injectable } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Categoria, CategoriaDb } from '../interfaces/categoria.interface';

@Injectable({ providedIn: 'root' })
export class CategoriasService {

  constructor(private supa: SupabaseService) {}

  private mapear(db: CategoriaDb): Categoria {
    return {
      id:     db.id,
      nombre: db.nombre,
      icono:  db.icono,
      orden:  db.orden
    };
  }

  getAll(): Observable<Categoria[]> {
    return from(
      this.supa.client
        .from('categorias')
        .select('*')
        .order('orden', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as CategoriaDb[]).map(c => this.mapear(c));
      })
    );
  }

  getById(id: string): Observable<Categoria> {
    return from(
      this.supa.client
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as CategoriaDb);
      })
    );
  }

  add(categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    return from(
      this.supa.client
        .from('categorias')
        .insert({
          nombre: categoria.nombre,
          icono:  categoria.icono,
          orden:  categoria.orden
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as CategoriaDb);
      })
    );
  }

  update(categoria: Categoria): Observable<Categoria> {
    return from(
      this.supa.client
        .from('categorias')
        .update({
          nombre: categoria.nombre,
          icono:  categoria.icono,
          orden:  categoria.orden
        })
        .eq('id', categoria.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as CategoriaDb);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supa.client
        .from('categorias')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}