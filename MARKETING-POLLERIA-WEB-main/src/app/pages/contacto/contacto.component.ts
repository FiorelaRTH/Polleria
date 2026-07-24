import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionService } from '../../services/configuracion.service';
import { ClientesService } from '../../services/clientes.service';
import { Configuracion } from '../../interfaces/configuracion.interface';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SafePipe, RevealDirective],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {

  config: Configuracion = {
    nombreNegocio:   'Pollería El Chino',
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

  form:      FormGroup;
  enviando   = false;
  enviadoOk  = false;
  errorMsg   = '';

  constructor(
    private configService:  ConfiguracionService,
    private clientesService: ClientesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre:  ['', [Validators.required, Validators.minLength(3)]],
      correo:  ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]]
    });
  }

  ngOnInit() {
    this.configService.getConfig().subscribe(c => this.config = c);
  }

  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.errorMsg = '';

    this.clientesService.registrar({
      nombre:  this.form.value.nombre,
      correo:  this.form.value.correo,
      celular: this.form.value.celular
    }).subscribe({
      next: () => {
        this.enviando  = false;
        this.enviadoOk = true;
        this.form.reset();
        setTimeout(() => this.enviadoOk = false, 5000);
      },
      error: (e) => {
        this.enviando = false;
        this.errorMsg = 'Error al registrar: ' + (e.message || 'Intenta nuevamente.');
      }
    });
  }

  get f() { return this.form.controls; }

  getWhatsappUrl(): string {
    return this.configService.getWhatsappUrl('Hola, necesito información 👋');
  }
}