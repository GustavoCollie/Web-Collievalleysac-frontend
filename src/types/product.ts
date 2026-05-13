export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image_url: string;
  price_per_kg: number;
  currency: string;
  season_start: number;
  season_end: number;
  is_available: boolean;
}
