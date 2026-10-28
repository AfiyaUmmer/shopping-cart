
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { calculateCartTotals } from "../utils/cartCalculations";
import {
  shippingSchema,
  type ShippingDetails,
} from "../schemas/shippingSchema";

const initialShipping: ShippingDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

const fields: {
  name: keyof ShippingDetails;
  label: string;
  type: string;
}[] = [
  { name: "fullName", label: "Full name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone number", type: "tel" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "postalCode", label: "Postal code", type: "text" },
];

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState(0);
  const [shipping, setShipping] =
    useState<ShippingDetails>(initialShipping);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingDetails, string>>
  >({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { subtotal, tax, discount, total, canCheckout } =
    calculateCartTotals(items);

  function validateShipping(): boolean {
    const result = shippingSchema.safeParse(shipping);

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof ShippingDetails, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ShippingDetails;
        nextErrors[field] = issue.message;
      });

      setErrors(nextErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  function continueToPayment() {
    if (validateShipping()) {
      setStep(2);
    }
  }

  function placeOrder() {
    if (!canCheckout || items.length === 0) return;

    setOrderPlaced(true);
    clearCart();
  }

  if (orderPlaced) {
    return (
      <section id="checkout" className="card border-0 shadow-sm mt-4">
        <div className="card-body text-center p-5">
          <div className="display-4 mb-3">✓</div>
          <h2 className="h3">Order placed successfully!</h2>
          <p className="text-secondary">
            Thank you, {shipping.fullName}. Your order has been confirmed.
          </p>
          <button
            className="btn btn-dark"
            onClick={() => {
              setOrderPlaced(false);
              setStep(0);
              setShipping(initialShipping);
            }}
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="card border-0 shadow-sm mt-4">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">Checkout</h2>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {["1. Cart Review", "2. Shipping", "3. Payment Summary"].map(
            (label, index) => (
              <span
                key={label}
                className={`badge ${
                  step === index
                    ? "text-bg-dark"
                    : "text-bg-light border"
                } p-2`}
              >
                {label}
              </span>
            )
          )}
        </div>

        {step === 0 && (
          <>
            <h3 className="h5">Review your cart</h3>

            {items.length === 0 ? (
              <p className="text-secondary">
                Your cart is empty. Add products before checkout.
              </p>
            ) : (
              <>
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="d-flex justify-content-between gap-3 border-bottom py-2"
                  >
                    <span>
                      {product.title} × {quantity}
                    </span>
                    <strong>
                      ${(product.price * quantity).toFixed(2)}
                    </strong>
                  </div>
                ))}

                <PriceSummary
                  subtotal={subtotal}
                  tax={tax}
                  discount={discount}
                  total={total}
                />

                {!canCheckout && (
                  <p className="text-danger small">
                    Your subtotal must be at least $10 to continue.
                  </p>
                )}

                <button
                  className="btn btn-dark mt-3"
                  disabled={!canCheckout || items.length === 0}
                  onClick={() => setStep(1)}
                >
                  Continue to Shipping
                </button>
              </>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="h5">Shipping details</h3>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                continueToPayment();
              }}
              noValidate
            >
              <div className="row g-3">
                {fields.map((field) => (
                  <div className="col-12 col-md-6" key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="form-label"
                    >
                      {field.label}
                    </label>

                    <input
                      id={field.name}
                      type={field.type}
                      className={`form-control ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      value={shipping[field.name]}
                      onChange={(event) => {
                        setShipping((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }));

                        setErrors((current) => ({
                          ...current,
                          [field.name]: undefined,
                        }));
                      }}
                      aria-invalid={Boolean(errors[field.name])}
                    />

                    {errors[field.name] && (
                      <div className="invalid-feedback">
                        {errors[field.name]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setStep(0)}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-dark">
                  Review Order
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="h5">Payment Summary</h3>
            <p className="text-secondary small">
              Review your shipping details and order total before placing
              your order. No payment will be collected in this demo.
            </p>

            <div className="bg-light rounded p-3 mb-4">
              <h4 className="h6">Shipping details</h4>
              <p className="mb-1">{shipping.fullName}</p>
              <p className="mb-1">{shipping.email}</p>
              <p className="mb-1">{shipping.phone}</p>
              <p className="mb-1">{shipping.address}</p>
              <p className="mb-0">
                {shipping.city}, {shipping.postalCode}
              </p>
            </div>

            <h4 className="h6">Order items</h4>
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="d-flex justify-content-between gap-3 border-bottom py-2"
              >
                <span>
                  {product.title} × {quantity}
                </span>
                <strong>
                  ${(product.price * quantity).toFixed(2)}
                </strong>
              </div>
            ))}

            <PriceSummary
              subtotal={subtotal}
              tax={tax}
              discount={discount}
              total={total}
            />

            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="btn btn-success"
                disabled={!canCheckout || items.length === 0}
                onClick={placeOrder}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function PriceSummary({
  subtotal,
  tax,
  discount,
  total,
}: {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}) {
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between py-1">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between py-1">
        <span>Tax (5%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between py-1">
        <span>Discount</span>
        <span>−${discount.toFixed(2)}</span>
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <strong>Final Total</strong>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
