import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionService } from '../../../services/configuracion.service';
import { Configuracion } from '../../../interfaces/configuracion.interface';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;

  form!:       FormGroup;
  guardando    = false;
  guardadoOk   = false;
  errorMsg     = '';
  logoPreview  = '';
  logoFile:    File | null = null;
  bannerPreview = '';
  bannerFile:   File | null = null;
  configId     = '';

  constructor(
    private fb:   FormBuilder,
    private svc:  ConfiguracionService,
    private supa: SupabaseService
  ) {}

  ngOnInit() {
    this.svc.getConfig().subscribe(c => {
      if (!this.form) {
        this.configId      = c.id ?? '';
        this.logoPreview   = c.logo;
        this.bannerPreview = c.bannerCarta;

        this.form = this.fb.group({
          nombreNegocio:   [c.nombreNegocio,   Validators.required],
          direccion:       [c.direccion,       Validators.required],
          telefono:        [c.telefono,        Validators.required],
          correo:          [c.correo,          [Validators.required, Validators.email]],
          whatsapp:        [c.whatsapp,        Validators.required],
          horario:         [c.horario,         Validators.required],
          facebook:        [c.facebook],
          instagram:       [c.instagram],
          googleMapsUrl:   [c.googleMapsUrl],
          googleMapsEmbed: [c.googleMapsEmbed]
        });
      }
    });
  }

  get f() { return this.form?.controls ?? {}; }

  onLogoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.logoFile = file;
    const reader  = new FileReader();
    reader.onload = ev => { this.logoPreview = ev.target?.result as string; };
    reader.readAsDataURL(file);
  }

  abrirLogoSelector() { this.logoInput.nativeElement.click(); }

  onBannerChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.bannerFile = file;
    const reader  = new FileReader();
    reader.onload = ev => { this.bannerPreview = ev.target?.result as string; };
    reader.readAsDataURL(file);
  }

  abrirBannerSelector() { this.bannerInput.nativeElement.click(); }

  async guardar() {
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg  = '';

    try {
      let logoUrl   = this.logoPreview;
      let bannerUrl = this.bannerPreview;

      if (this.logoFile) {
        const ext   = this.logoFile.name.split('.').pop();
        const nombre = `logo_${Date.now()}.${ext}`;
        logoUrl      = await this.supa.subirImagen('configuracion', nombre, this.logoFile);
      }

      if (this.bannerFile) {
        const ext    = this.bannerFile.name.split('.').pop();
        const nombre = `banner_${Date.now()}.${ext}`;
        bannerUrl    = await this.supa.subirImagen('configuracion', nombre, this.bannerFile);
      }

      const data: Configuracion = {
        id:              this.configId,
        nombreNegocio:   this.form.value.nombreNegocio,
        direccion:       this.form.value.direccion,
        telefono:        this.form.value.telefono,
        correo:          this.form.value.correo,
        whatsapp:        this.form.value.whatsapp,
        horario:         this.form.value.horario,
        facebook:        this.form.value.facebook  || '',
        instagram:       this.form.value.instagram || '',
        googleMapsUrl:   this.form.value.googleMapsUrl   || '',
        googleMapsEmbed: this.form.value.googleMapsEmbed || '',
        logo:            logoUrl,
        bannerCarta:     bannerUrl
      };

      this.svc.updateConfig(data).subscribe({
        next: () => {
          this.guardando  = false;
          this.guardadoOk = true;
          setTimeout(() => this.guardadoOk = false, 3000);
        },
        error: e => {
          this.guardando = false;
          this.errorMsg  = 'Error al guardar: ' + e.message;
        }
      });
    } catch (e: any) {
      this.guardando = false;
      this.errorMsg  = 'Error al subir logo: ' + e.message;
    }
  }
}