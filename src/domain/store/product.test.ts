import { describe, expect, it } from "vitest";
import { getTotalStock, isInStock, isSoldOut, type Product } from "./product";

const buildProduct = (overrides: Partial<Product>): Product => ({
  id: "id",
  slug: "slug",
  name: "name",
  description: "description",
  price: 10,
  currency: "EUR",
  images: [],
  stock: [],
  category: "sticker",
  featured: false,
  ...overrides,
});

describe("getTotalStock", () => {
  it("adds up the quantity of every size", () => {
    const product = buildProduct({
      stock: [
        { size: "S", quantity: 2 },
        { size: "M", quantity: 3 },
      ],
    });

    expect(getTotalStock(product)).toBe(5);
  });

  it("returns 0 when the product has no stock entries", () => {
    expect(getTotalStock(buildProduct({ stock: [] }))).toBe(0);
  });
});

describe("isSoldOut", () => {
  it("is false while any size has units left", () => {
    const product = buildProduct({
      stock: [
        { size: "S", quantity: 0 },
        { size: "M", quantity: 1 },
      ],
    });

    expect(isSoldOut(product)).toBe(false);
  });

  it("is true when every size is at zero", () => {
    expect(isSoldOut(buildProduct({ stock: [{ size: "ONE", quantity: 0 }] }))).toBe(true);
  });

  it("is true when there is no stock information", () => {
    expect(isSoldOut(buildProduct({ stock: [] }))).toBe(true);
  });
});

describe("isInStock", () => {
  it("checks a single size", () => {
    const product = buildProduct({ stock: [{ size: "ONE", quantity: 4 }] });

    expect(isInStock(product, "ONE")).toBe(true);
    expect(isInStock(product, "S")).toBe(false);
  });
});
