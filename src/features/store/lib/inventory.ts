import stockData from "../../../../content/stock.json";
import type { Product, Size } from "../types";

export function getProducts(): Product[] {
  return stockData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function isInStock(product: Product, size: Size): boolean {
  const entry = product.stock.find((s) => s.size === size);
  return (entry?.quantity ?? 0) > 0;
}
