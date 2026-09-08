const API_BASE =
  import.meta.env.PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8080/api/v1";
const CART_ID_KEY = "vaya_cart_id";

function getCartId(): string | null {
  try {
    return localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
}
function setCartId(id: string): void {
  try {
    localStorage.setItem(CART_ID_KEY, id);
  } catch {
    /* ignore */
  }
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const cartId = getCartId();
  if (cartId) headers["X-Cart-Id"] = cartId;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  const cart = await res.json();
  if (cart.cart_id) setCartId(cart.cart_id);
  return cart;
}

export function getCart() {
  return request("/cart");
}
export function addToCart(productId: number, quantity = 1) {
  return request("/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}
export function updateCartItem(productId: number, quantity: number) {
  return request(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}
export function removeCartItem(productId: number) {
  return request(`/cart/items/${productId}`, { method: "DELETE" });
}

export function clearCart() {
  return request("/cart", { method: "DELETE" });
}
