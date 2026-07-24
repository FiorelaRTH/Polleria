export interface Producto {
  id:          string;
  nombre:      string;
  descripcion: string;
  precio:      number;
  categoriaId: string;   // mapeado desde categoria_id
  imagen:      string;
  disponible:  boolean;
  destacado:   boolean;
  incluye:     string[];
  creadoEn?:   string;
}

// Tipo que refleja exactamente la estructura de la tabla en Supabase
export interface ProductoDb {
  id:           string;
  nombre:       string;
  descripcion:  string;
  precio:       number;
  categoria_id: string | null;
  imagen:       string;
  disponible:   boolean;
  destacado:    boolean;
  incluye:      string[];
  creado_en:    string;
}