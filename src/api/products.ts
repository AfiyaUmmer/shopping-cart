
import { productsResponseSchema } from "../schemas/productSchema";
import type { Product } from "../types/product";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(
    "https://dummyjson.com/products?limit=30"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products. Please try again.");
  }

  const data: unknown = await response.json();

  const validatedData = productsResponseSchema.parse(data);

  return validatedData.products;
}
