import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { BehaviorSubject } from 'rxjs';
import { Session } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private session$ = new BehaviorSubject<Session | null>(null);

  constructor(
    private supa:   SupabaseService,
    private router: Router
  ) {
    // Carga la sesión activa al iniciar
    this.supa.getSession().then(({ data }) => {
      this.session$.next(data.session);
    });

    // Escucha cambios de sesión en tiempo real
    this.supa.onAuthChange((_event, session) => {
      this.session$.next(session);
    });
  }

  async login(credenciales: { email: string; password: string }): Promise<boolean> {
    const { data, error } = await this.supa.signIn(
      credenciales.email,
      credenciales.password
    );
    if (error || !data.session) return false;
    this.session$.next(data.session);
    return true;
  }

  async logout() {
    await this.supa.signOut();
    this.session$.next(null);
    this.router.navigate(['/admin/login']);
  }

  estaAutenticado(): boolean {
    return !!this.session$.value;
  }

  getEmail(): string {
    return this.session$.value?.user?.email ?? '';
  }

  getSession() {
    return this.session$.asObservable();
  }
}