export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "ONE";

export type StockItem = {
  size: Size;
  quantity: number;
};

export type ProductCategory = "jersey" | "hoodie" | "sticker";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: "EUR" | "USD";
  images: string[];
  stock: StockItem[];
  category: ProductCategory;
  featured: boolean;
};

export function isInStock(product: Product, size: Size): boolean {
  const entry = product.stock.find((item) => item.size === size);
  return (entry?.quantity ?? 0) > 0;
}

export function getTotalStock(product: Product): number {
  return product.stock.reduce((total, item) => total + item.quantity, 0);
}

export function isSoldOut(product: Product): boolean {
  return getTotalStock(product) === 0;
}
