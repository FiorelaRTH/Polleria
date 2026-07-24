import { Injectable } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Promocion, PromocionDb } from '../interfaces/promocion.interface';

@Injectable({ providedIn: 'root' })
export class PromocionesService {

  constructor(private supa: SupabaseService) {}

  private mapear(db: PromocionDb): Promocion {
    return {
      id:          db.id,
      titulo:      db.titulo,
      descripcion: db.descripcion,
      imagen:      db.imagen,
      activa:      db.activa,
      fechaInicio: db.fecha_inicio ?? undefined,
      fechaFin:    db.fecha_fin    ?? undefined
    };
  }

  getAll(): Observable<Promocion[]> {
    return from(
      this.supa.client
        .from('promociones')
        .select('*')
        .order('creado_en', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as PromocionDb[]).map(p => this.mapear(p));
      })
    );
  }

  getActivas(): Observable<Promocion[]> {
    return from(
      this.supa.client
        .from('promociones')
        .select('*')
        .eq('activa', true)
        .order('creado_en', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as PromocionDb[]).map(p => this.mapear(p));
      })
    );
  }

  add(promo: Omit<Promocion, 'id'>): Observable<Promocion> {
    return from(
      this.supa.client
        .from('promociones')
        .insert({
          titulo:       promo.titulo,
          descripcion:  promo.descripcion,
          imagen:       promo.imagen,
          activa:       promo.activa,
          fecha_inicio: promo.fechaInicio || null,
          fecha_fin:    promo.fechaFin    || null
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as PromocionDb);
      })
    );
  }

  update(promo: Promocion): Observable<Promocion> {
    return from(
      this.supa.client
        .from('promociones')
        .update({
          titulo:       promo.titulo,
          descripcion:  promo.descripcion,
          imagen:       promo.imagen,
          activa:       promo.activa,
          fecha_inicio: promo.fechaInicio || null,
          fecha_fin:    promo.fechaFin    || null
        })
        .eq('id', promo.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as PromocionDb);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supa.client
        .from('promociones')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}