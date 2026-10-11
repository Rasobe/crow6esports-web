import type { Product } from "@/domain/store/product";
import type { ProductRepository } from "@/domain/store/product.repository";

export function getProducts(repository: ProductRepository): Product[] {
  return repository.findAll();
}

export function getProductBySlug(repository: ProductRepository, slug: string): Product | undefined {
  return repository.findAll().find((product) => product.slug === slug);
}
