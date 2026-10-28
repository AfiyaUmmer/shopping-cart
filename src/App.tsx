
import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
import { fetchProducts } from "./api/products";
import ProductCard from "./components/ProductCard";
import CartPanel from "./components/CartPanel";
import Checkout from "./components/Checkout";
import { useProductFilters } from "./hooks/useProductFilters";
import type { Product } from "./types/product";
import { useCartStore } from "./store/cartStore";

export default function App() {
  const items = useCartStore((state) => state.items);
const addToCart = useCartStore((state) => state.addToCart);

const cartCount = items.reduce(
  (total, item) => total + item.quantity,
  0
);
  

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const {
    search,
    setSearch,
    category,
    setCategory,
    maxPrice,
    setMaxPrice,
    categories,
    filteredProducts,
    clearFilters,
  } = useProductFilters(products);

  function handleAddToCart(product: Product) {
  addToCart(product);
}

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar bg-white border-bottom sticky-top">
        <div className="container py-2">
          <a className="navbar-brand fw-bold" href="#">
            ShopEase
          </a>

          <span className="btn btn-outline-dark">
            🛒 Cart ({cartCount})
          </span>
        </div>
      </nav>

      <main className="container py-4 py-md-5">
        <div className="mb-4">
          <h1 className="fw-bold">Discover Products</h1>
          <p className="text-secondary">
            Find your everyday essentials at great prices.
          </p>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label htmlFor="search" className="form-label">
                  Search products
                </label>
                <input
                  id="search"
                  className="form-control"
                  placeholder="Search by product title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label htmlFor="price" className="form-label">
                  Maximum price: ${maxPrice}
                </label>
                <input
                  id="price"
                  type="range"
                  className="form-range"
                  min="0"
                  max="2000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              <div className="col-12 col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-5" role="status">
            <div className="spinner-border text-dark" />
            <p className="mt-3">Loading products...</p>
          </div>
        )}

        {isError && (
          <div className="alert alert-danger">
            <p className="mb-2">
              {error instanceof Error
                ? error.message
                : "Unable to load products."}
            </p>
            <button className="btn btn-danger" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <p className="text-secondary">
              Showing {filteredProducts.length} products
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center bg-white rounded p-5">
                <h5>No products found</h5>
                <p className="text-secondary">
                  Try changing your search or filters.
                </p>
                <button
                  className="btn btn-dark"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                    key={product.id}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <CartPanel />
        <Checkout />
      </main>
    </div>
  );
}
