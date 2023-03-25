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