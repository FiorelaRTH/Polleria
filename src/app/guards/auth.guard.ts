import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../admin/services/auth.service';
import { from, map } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const supa   = inject(SupabaseService);

  return from(supa.getSession()).pipe(
    map(({ data }) => {
      if (data.session) return true;
      router.navigate(['/admin/login']);
      return false;
    })
  );
};