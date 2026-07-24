import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, map, tap } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Configuracion, ConfiguracionDb } from '../interfaces/configuracion.interface';

const CONFIG_VACIA: Configuracion = {
  nombreNegocio:   '',
  direccion:       '',
  telefono:        '',
  whatsapp:        '',
  correo:          '',
  horario:         '',
  facebook:        '',
  instagram:       '',
  googleMapsUrl:   '',
  googleMapsEmbed: '',
  logo:            '',
  bannerCarta:     ''
};

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {

  private config$ = new BehaviorSubject<Configuracion>({ ...CONFIG_VACIA });

  constructor(private supa: SupabaseService) {
    this.cargarDesdeSupabase();
  }

  private mapear(db: ConfiguracionDb): Configuracion {
    return {
      id:              db.id,
      nombreNegocio:   db.nombre_negocio,
      direccion:       db.direccion,
      telefono:        db.telefono,
      whatsapp:        db.whatsapp,
      correo:          db.correo,
      horario:         db.horario,
      facebook:        db.facebook,
      instagram:       db.instagram,
      googleMapsUrl:   db.google_maps_url,
      googleMapsEmbed: db.google_maps_embed,
      logo:            db.logo,
      bannerCarta:     db.banner_carta
    };
  }

  private cargarDesdeSupabase() {
    this.supa.client
      .from('configuracion')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          this.config$.next(this.mapear(data as ConfiguracionDb));
        }
      });
  }

  getConfig(): Observable<Configuracion> {
    return this.config$.asObservable();
  }

  getConfigSnapshot(): Configuracion {
    return this.config$.value;
  }

  update(config: Configuracion): Observable<Configuracion> {
    const id = config.id;

    return from(
      this.supa.client
        .from('configuracion')
        .update({
          nombre_negocio:    config.nombreNegocio,
          direccion:         config.direccion,
          telefono:          config.telefono,
          whatsapp:          config.whatsapp,
          correo:            config.correo,
          horario:           config.horario,
          facebook:          config.facebook,
          instagram:         config.instagram,
          google_maps_url:   config.googleMapsUrl,
           google_maps_embed: config.googleMapsEmbed,
           logo:              config.logo,
           banner_carta:      config.bannerCarta
        })
        .eq('id', id!)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapear(data as ConfiguracionDb);
      }),
      tap(nueva => this.config$.next(nueva))
    );
  }

  getWhatsappUrl(mensaje?: string): string {
    const numero = this.config$.value.whatsapp || '51999999999';
    const texto  = mensaje ? encodeURIComponent(mensaje) : '';
    return `https://wa.me/${numero}?text=${texto}`;
  }

  // Alias para compatibilidad con el componente de configuración admin
  updateConfig(config: Configuracion): Observable<Configuracion> {
    return this.update(config);
  }
}