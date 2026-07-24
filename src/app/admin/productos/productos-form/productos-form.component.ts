import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../interfaces/producto.interface';
import { Categoria } from '../../../interfaces/categoria.interface';
import { ProductosService } from '../../../services/productos.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.scss']
})
export class ProductosFormComponent implements OnInit {

  @Input()  producto:   Producto | null = null;
  @Input()  categorias: Categoria[]     = [];
  @Output() guardado   = new EventEmitter<void>();
  @Output() cancelado  = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!:         FormGroup;
  guardando      = false;
  errorMsg       = '';
  dragOver       = false;
  imagenPreview  = '';
  imagenFile:    File | null = null;
  incluyeNuevo   = '';
  incluye:       string[] = [];
  esEdicion      = false;

  constructor(
    private fb:                FormBuilder,
    private productosService:  ProductosService,
    private supabaseService:   SupabaseService
  ) {}

  ngOnInit() {
    this.esEdicion    = !!this.producto;
    this.incluye      = this.producto?.incluye ? [...this.producto.incluye] : [];
    this.imagenPreview = this.producto?.imagen ?? '';

    this.form = this.fb.group({
      nombre:      [this.producto?.nombre      ?? '', [Validators.required, Validators.minLength(3)]],
      descripcion: [this.producto?.descripcion ?? '', Validators.required],
      precio:      [this.producto?.precio      ?? '', [Validators.required, Validators.min(0.1)]],
      categoriaId: [this.producto?.categoriaId ?? '', Validators.required],
      disponible:  [this.producto?.disponible  ?? true],
      destacado:   [this.producto?.destacado   ?? false]
    });
  }

  get f() { return this.form.controls; }

  onDragOver(e: DragEvent)  { e.preventDefault(); this.dragOver = true; }
  onDragLeave()              { this.dragOver = false; }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.procesarArchivo(file);
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.procesarArchivo(file);
  }

  procesarArchivo(file: File) {
    if (!file.type.startsWith('image/')) return;
    this.imagenFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.imagenPreview = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  abrirSelector() { this.fileInput.nativeElement.click(); }

  agregarIncluye() {
    const val = this.incluyeNuevo.trim();
    if (val && !this.incluye.includes(val)) this.incluye.push(val);
    this.incluyeNuevo = '';
  }

  quitarIncluye(item: string) {
    this.incluye = this.incluye.filter(i => i !== item);
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg  = '';

    try {
      let imagenUrl = this.producto?.imagen ?? '';

      // Si hay un archivo nuevo, subirlo a Supabase Storage
      if (this.imagenFile) {
        const ext      = this.imagenFile.name.split('.').pop();
        const nombre   = `producto_${Date.now()}.${ext}`;
        imagenUrl      = await this.supabaseService.subirImagen('productos', nombre, this.imagenFile);
      }

      const data: Omit<Producto, 'id' | 'creadoEn'> = {
        nombre:      this.form.value.nombre,
        descripcion: this.form.value.descripcion,
        precio:      Number(this.form.value.precio),
        categoriaId: this.form.value.categoriaId,
        imagen:      imagenUrl,
        disponible:  this.form.value.disponible,
        destacado:   this.form.value.destacado,
        incluye:     this.incluye
      };

      if (this.esEdicion && this.producto) {
        this.productosService.update({ ...data, id: this.producto.id }).subscribe({
          next: () => { this.guardando = false; this.guardado.emit(); },
          error: e => { this.guardando = false; this.errorMsg = e.message; }
        });
      } else {
        this.productosService.add(data).subscribe({
          next: () => { this.guardando = false; this.guardado.emit(); },
          error: e => { this.guardando = false; this.errorMsg = e.message; }
        });
      }
    } catch (e: any) {
      this.guardando = false;
      this.errorMsg  = 'Error al subir imagen: ' + e.message;
    }
  }

  cancelar() { this.cancelado.emit(); }
}