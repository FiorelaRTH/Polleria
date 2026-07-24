import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../../services/categorias.service';
import { Categoria } from '../../../interfaces/categoria.interface';
import { CategoriasFormComponent } from '../categorias-form/categorias-form.component';

@Component({
  selector: 'app-categorias-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoriasFormComponent],
  templateUrl: './categorias-lista.component.html',
  styleUrls: ['./categorias-lista.component.scss']
})
export class CategoriasListaComponent implements OnInit {

  categorias: Categoria[] = [];
  mostrarForm   = false;
  categoriaEdit: Categoria | null = null;

  mostrarConfirm     = false;
  categoriaAEliminar: Categoria | null = null;

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.categoriasService.getAll().subscribe(c => this.categorias = c);
  }

  nueva() {
    this.categoriaEdit = null;
    this.mostrarForm   = true;
  }

  editar(c: Categoria) {
    this.categoriaEdit = { ...c };
    this.mostrarForm   = true;
  }

  confirmarEliminar(c: Categoria) {
    this.categoriaAEliminar = c;
    this.mostrarConfirm     = true;
  }

  eliminar() {
    if (this.categoriaAEliminar) {
      this.categoriasService.delete(this.categoriaAEliminar.id);
      this.mostrarConfirm     = false;
      this.categoriaAEliminar = null;
      this.cargar();
    }
  }

  cancelarEliminar() {
    this.mostrarConfirm     = false;
    this.categoriaAEliminar = null;
  }

  onFormGuardado() {
    this.mostrarForm = false;
    this.cargar();
  }

  onFormCancelado() {
    this.mostrarForm = false;
  }
}