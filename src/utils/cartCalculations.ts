
import type { CartItem } from "../store/cartStore";

export interface CartTotals {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  canCheckout: boolean;
}

export function calculateCartTotals(
  items: CartItem[]
): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;
  const discount = subtotal > 100 ? subtotal * 0.10 : 0;
  const total = subtotal + tax - discount;

  return {
    subtotal,
    tax,
    discount,
    total,
    canCheckout: subtotal >= 10,
  };
}
