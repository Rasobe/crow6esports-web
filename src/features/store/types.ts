export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type StockItem = {
  size: Size;
  quantity: number;
};

export type ProductCategory = "jersey" | "hoodie" | "cap" | "accessory";

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
