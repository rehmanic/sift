import type {
  Product,
  Brand,
  User,
  UserPreferences,
  ConfidenceResponse,
  Alternative,
} from "@/types/types";

const API_BASE = "http://localhost:3001/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));

  const qs = params.toString();
  return fetchJson(`${API_BASE}/products${qs ? `?${qs}` : ""}`);
}

export function getProduct(id: string): Promise<Product> {
  return fetchJson(`${API_BASE}/products/${id}`);
}

export function getCategories(): Promise<string[]> {
  return fetchJson(`${API_BASE}/products/categories`);
}

export function getConfidence(productId: string, userId = "u1"): Promise<ConfidenceResponse> {
  return fetchJson(`${API_BASE}/products/${productId}/confidence?userId=${userId}`);
}

export function getAlternatives(productId: string, userId = "u1"): Promise<Alternative[]> {
  return fetchJson(`${API_BASE}/products/${productId}/alternatives?userId=${userId}`);
}

export function getBrand(id: string): Promise<Brand> {
  return fetchJson(`${API_BASE}/brands/${id}`);
}

export function getUser(id: string): Promise<User> {
  return fetchJson(`${API_BASE}/users/${id}`);
}

export function updatePreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<User> {
  return fetchJson(`${API_BASE}/users/${userId}/preferences`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences),
  });
}
