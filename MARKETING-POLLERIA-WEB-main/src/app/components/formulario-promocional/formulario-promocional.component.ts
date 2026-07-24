import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-formulario-promocional',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-promocional.component.html'
})
export class FormularioPromocionalComponent {

  @Output() guardado = new EventEmitter<void>();
  @Output() omitido  = new EventEmitter<void>();

  form: FormGroup;
  guardando = false;
  guardadoOk = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {
    this.form = this.fb.group({
      nombre:  ['', [Validators.required, Validators.minLength(3)]],
      correo:  ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.clientesService.registrar(this.form.value).subscribe(() => {
      this.guardando  = false;
      this.guardadoOk = true;
      setTimeout(() => this.guardado.emit(), 2000);
    });
  }

  omitir() {
    this.omitido.emit();
  }

  get f() { return this.form.controls; }
}