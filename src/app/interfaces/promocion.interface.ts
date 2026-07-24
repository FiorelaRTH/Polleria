export interface Promocion {
  id:          string;
  titulo:      string;
  descripcion: string;
  imagen:      string;
  activa:      boolean;
  fechaInicio?: string;
  fechaFin?:   string;
}

export interface PromocionDb {
  id:           string;
  titulo:       string;
  descripcion:  string;
  imagen:       string;
  activa:       boolean;
  fecha_inicio: string | null;
  fecha_fin:    string | null;
  creado_en:    string;
}