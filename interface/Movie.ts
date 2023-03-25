export interface IMovie {
  title: string;
  link: string | undefined;
  slug?: string | undefined;
  thumbnail_url: string | undefined;
  duration: string;
  rating: string;
  quality: string;
  episode?: string;
}

export interface IContainerMovieData {
  Tagline: string | undefined;
  Rating: string | undefined;
  Genre: string | undefined;
  Kualitas: string | undefined;
  Tahun: string | undefined;
  Durasi: string | undefined;
  Negara: string | undefined;
  Rilis: string | undefined;
  Bahasa: string | undefined;
  Direksi: string | undefined;
  Pemain: string | undefined;
}

export interface IContainerTVData {
  Genre: string | undefined;
  Tahun: string | undefined;
  Negara: string | undefined;
  Rilis: string | undefined;
  Episode: string | undefined;
  Jaringan: string | undefined;
  Pemain: string | undefined;
}

export interface MovieData {
  title: string;
  thumbnail_url: string | undefined;
}

export interface MovieDetail {
  description: string;
  created_at: string;
  tagline?: string;
  rating?: string;
  genre?: string;
  quality?: string;
  year?: string;
  duration?: string;
  country?: string;
  realease?: string;
  language?: string;
  director?: string;
  artist?: string;
}
