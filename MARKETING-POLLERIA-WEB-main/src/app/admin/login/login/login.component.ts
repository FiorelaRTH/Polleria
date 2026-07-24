import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form:       FormGroup;
  cargando    = false;
  errorMsg    = '';
  verPassword = false;

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    if (this.auth.estaAutenticado()) {
      this.router.navigate(['/admin/dashboard']);
    }

    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ingresar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const ok = await this.auth.login({
      email:    this.form.value.email,
      password: this.form.value.password
    });

    this.cargando = false;

    if (ok) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.errorMsg = 'Correo o contraseña incorrectos.';
    }
  }

  get f() { return this.form.controls; }
}