
import { useCartStore } from "../store/cartStore";
import { calculateCartTotals } from "../utils/cartCalculations";

export default function CartPanel() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );
  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );
  const clearCart = useCartStore((state) => state.clearCart);

  const { subtotal, tax, discount, total, canCheckout } =
  calculateCartTotals(items);

  return (
    <section className="card border-0 shadow-sm mt-4" id="cart">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Your Cart</h2>
          {items.length > 0 && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-secondary mb-0">
            Your cart is empty. Add some products to get started!
          </p>
        ) : (
          <>
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="d-flex gap-3 align-items-center border-bottom py-3"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{
                    width: 65,
                    height: 65,
                    objectFit: "contain",
                  }}
                />

                <div className="flex-grow-1">
                  <h3 className="h6 mb-1">{product.title}</h3>
                  <p className="small text-secondary mb-2">
                    ${product.price.toFixed(2)} each
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={quantity <= 1}
                      onClick={() => decreaseQuantity(product.id)}
                      aria-label={`Decrease ${product.title} quantity`}
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={quantity >= 5}
                      onClick={() => increaseQuantity(product.id)}
                      aria-label={`Increase ${product.title} quantity`}
                    >
                      +
                    </button>

                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <strong>
                  ${(product.price * quantity).toFixed(2)}
                </strong>
              </div>
            ))}

            
<div className="text-end pt-3">
  <div className="d-flex justify-content-between">
    <span>Subtotal</span>
    <span>${subtotal.toFixed(2)}</span>
  </div>

  <div className="d-flex justify-content-between">
    <span>Tax (5%)</span>
    <span>${tax.toFixed(2)}</span>
  </div>

  <div className="d-flex justify-content-between">
    <span>Discount</span>
    <span>−${discount.toFixed(2)}</span>
  </div>

  <hr />

  <div className="d-flex justify-content-between mb-3">
    <strong>Final Total</strong>
    <strong>${total.toFixed(2)}</strong>
  </div>

  {!canCheckout && (
    <p className="text-danger small">
      Add products worth at least $10 to proceed to checkout.
    </p>
  )}

  <button
    className="btn btn-dark w-100"
    disabled={!canCheckout}
    onClick={() =>
      document.getElementById("checkout")?.scrollIntoView({
        behavior: "smooth",
      })
    }
  >
    Proceed to Checkout
  </button>
</div>

          </>
        )}
      </div>
    </section>
  );
}
