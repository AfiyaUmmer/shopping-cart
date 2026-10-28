
import { useMemo, useState } from "react";
import type { Product } from "../types/product";

export function useProductFilters(products: Product[]) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(2000);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, maxPrice]);

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setMaxPrice(2000);
  }

  return {
    search,
    setSearch,
    category,
    setCategory,
    maxPrice,
    setMaxPrice,
    categories,
    filteredProducts,
    clearFilters,
  };
}
