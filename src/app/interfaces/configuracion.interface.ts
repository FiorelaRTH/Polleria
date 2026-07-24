export interface Configuracion {
  id?:             string;
  nombreNegocio:   string;
  direccion:       string;
  telefono:        string;
  whatsapp:        string;
  correo:          string;
  horario:         string;
  facebook:        string;
  instagram:       string;
  googleMapsUrl:   string;
  googleMapsEmbed: string;
  logo:            string;
  bannerCarta:     string;
}

export interface ConfiguracionDb {
  id:                string;
  nombre_negocio:    string;
  direccion:         string;
  telefono:          string;
  whatsapp:          string;
  correo:            string;
  horario:           string;
  facebook:          string;
  instagram:         string;
  google_maps_url:   string;
  google_maps_embed: string;
  logo:              string;
  banner_carta:      string;
}