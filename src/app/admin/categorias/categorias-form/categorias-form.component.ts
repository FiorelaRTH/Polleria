import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../../interfaces/categoria.interface';
import { CategoriasService } from '../../../services/categorias.service';

const ICONOS_DISPONIBLES = [
  'bi-egg-fried', 'bi-bag-heart', 'bi-cup-straw', 'bi-basket',
  'bi-fire', 'bi-star', 'bi-heart', 'bi-tag', 'bi-grid',
  'bi-list', 'bi-box-seam', 'bi-gift', 'bi-truck', 'bi-shop'
];

@Component({
  selector: 'app-categorias-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias-form.component.html',
  styleUrls: ['./categorias-form.component.scss']
})
export class CategoriasFormComponent implements OnInit {

  @Input()  categoria: Categoria | null = null;
  @Output() guardado  = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  form!:     FormGroup;
  guardando  = false;
  esEdicion  = false;
  iconos     = ICONOS_DISPONIBLES;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit() {
    this.esEdicion = !!this.categoria;

    this.form = this.fb.group({
      nombre: [this.categoria?.nombre ?? '', [Validators.required, Validators.minLength(2)]],
      icono:  [this.categoria?.icono  ?? 'bi-tag', Validators.required],
      orden:  [this.categoria?.orden  ?? 1, [Validators.required, Validators.min(1)]]
    });
  }

  get f() { return this.form.controls; }

  seleccionarIcono(icono: string) {
    this.form.patchValue({ icono });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const data: Categoria = {
      id:     this.categoria?.id ?? 'cat-' + Date.now(),
      nombre: this.form.value.nombre,
      icono:  this.form.value.icono,
      orden:  Number(this.form.value.orden)
    };

    setTimeout(() => {
      if (this.esEdicion) {
        this.categoriasService.update(data);
      } else {
        this.categoriasService.add(data);
      }
      this.guardando = false;
      this.guardado.emit();
    }, 500);
  }

  cancelar() {
    this.cancelado.emit();
  }
}