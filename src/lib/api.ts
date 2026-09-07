const API_BASE = import.meta.env.API_BASE_URL ?? "http://127.0.0.1:8080/api/v1";

export interface ProductImage {
  src: string;
  alt: string;
}
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  average_rating: string;
  rating_count: number;
  currency: string;
  image: ProductImage | null;
  categories: ProductCategory[];
}

export async function getProducts(
  params: Record<string, string | number> = {},
): Promise<ProductSummary[]> {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  const res = await fetch(`${API_BASE}/products${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
  return res.json();
}

export interface ProductTag { id: number; name: string; slug: string; }
export interface ProductAttribute { name: string; options: string[]; }

export interface ProductDetail extends Omit<ProductSummary, "image"> {
  sku: string;
  short_description: string;
  description: string;
  images: ProductImage[];
  tags: ProductTag[];
  attributes: ProductAttribute[];
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
  return res.json();
}
