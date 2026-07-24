export interface Categoria {
  id:     string;
  nombre: string;
  icono:  string;
  orden:  number;
}

export interface CategoriaDb {
  id:        string;
  nombre:    string;
  icono:     string;
  orden:     number;
  creado_en: string;
}