interface SearchFilters {
  brand?: string;
  series?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  city?: string;
  district?: string;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  damage_status?: string;
  color?: string;
}

export function buildSearchUrl(filters: SearchFilters, reasoning?: string): string {
  const params = new URLSearchParams();
  
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.series) params.set("series", filters.series);
  if (filters.model) params.set("model", filters.model);
  if (filters.year_min) params.set("year_min", filters.year_min.toString());
  if (filters.year_max) params.set("year_max", filters.year_max.toString());
  if (filters.price_min) params.set("price_min", filters.price_min.toString());
  if (filters.price_max) params.set("price_max", filters.price_max.toString());
  if (filters.mileage_max) params.set("mileage_max", filters.mileage_max.toString());
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.fuel_type) params.set("fuel_type", filters.fuel_type);
  if (filters.transmission) params.set("transmission", filters.transmission);
  if (filters.body_type) params.set("body_type", filters.body_type);
  if (filters.damage_status) params.set("damage_status", filters.damage_status);
  if (filters.color) params.set("color", filters.color);
  if (reasoning) params.set("reasoning", reasoning);

  const queryString = params.toString();
  return queryString ? `/araclar?${queryString}` : "/araclar";
}
