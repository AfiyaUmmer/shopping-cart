
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="card-img-top p-3"
        style={{ height: "190px", objectFit: "contain" }}
      />

      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">
          {product.category}
        </span>

        <h5 className="card-title">{product.title}</h5>

        <p className="text-muted small">
          ⭐ {product.rating.toFixed(1)} / 5
        </p>

        <div className="mt-auto">
          <p className="fs-5 fw-bold mb-3">
            ${product.price.toFixed(2)}
          </p>

          <button
            className="btn btn-dark w-100"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
