import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Promocion } from '../../../interfaces/promocion.interface';
import { PromocionesService } from '../../../services/promociones.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-promociones-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './promociones-form.component.html',
  styleUrls: ['./promociones-form.component.scss']
})
export class PromocionesFormComponent implements OnInit {

  @Input()  promocion: Promocion | null = null;
  @Output() guardado  = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!:        FormGroup;
  guardando     = false;
  errorMsg      = '';
  esEdicion     = false;
  imagenPreview = '';
  imagenFile:   File | null = null;
  dragOver      = false;

  constructor(
    private fb:   FormBuilder,
    private svc:  PromocionesService,
    private supa: SupabaseService
  ) {}

  ngOnInit() {
    this.esEdicion    = !!this.promocion;
    this.imagenPreview = this.promocion?.imagen ?? '';

    this.form = this.fb.group({
      titulo:      [this.promocion?.titulo      ?? '', [Validators.required, Validators.minLength(5)]],
      descripcion: [this.promocion?.descripcion ?? '', Validators.required],
      fechaInicio: [this.promocion?.fechaInicio ?? ''],
      fechaFin:    [this.promocion?.fechaFin    ?? ''],
      activa:      [this.promocion?.activa      ?? true]
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
    reader.onload = ev => { this.imagenPreview = ev.target?.result as string; };
    reader.readAsDataURL(file);
  }

  abrirSelector() { this.fileInput.nativeElement.click(); }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg  = '';

    try {
      let imagenUrl = this.promocion?.imagen ?? '';

      if (this.imagenFile) {
        const ext    = this.imagenFile.name.split('.').pop();
        const nombre = `promo_${Date.now()}.${ext}`;
        imagenUrl    = await this.supa.subirImagen('promociones', nombre, this.imagenFile);
      }

      const data: Omit<Promocion, 'id'> = {
        titulo:      this.form.value.titulo,
        descripcion: this.form.value.descripcion,
        imagen:      imagenUrl,
        fechaInicio: this.form.value.fechaInicio || undefined,
        fechaFin:    this.form.value.fechaFin    || undefined,
        activa:      this.form.value.activa
      };

      if (this.esEdicion && this.promocion) {
        this.svc.update({ ...data, id: this.promocion.id }).subscribe({
          next: () => { this.guardando = false; this.guardado.emit(); },
          error: e => { this.guardando = false; this.errorMsg = e.message; }
        });
      } else {
        this.svc.add(data).subscribe({
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