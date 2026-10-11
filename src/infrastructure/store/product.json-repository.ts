import stock from "@content/stock.json";
import type { Product } from "@/domain/store/product";
import type { ProductRepository } from "@/domain/store/product.repository";

export function createJsonProductRepository(): ProductRepository {
  return { findAll: () => stock as Product[] };
}
