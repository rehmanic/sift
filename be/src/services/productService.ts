import products from "../data/products.json";
import {
  Product,
  User,
  ConfidenceResponse,
  Alternative,
  StockStatus,
  PriceBreakdown,
  Variant,
} from "../types";
import * as brandService from "./brandService";

const productsData = products as Product[];

export function getAll(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Product[] {
  let result = productsData;

  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters?.minPrice !== undefined) {
    result = result.filter((p) => p.basePrice >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    result = result.filter((p) => p.basePrice <= filters.maxPrice!);
  }

  return result;
}

export function getById(id: string): Product | undefined {
  return productsData.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return [...new Set(productsData.map((p) => p.category))];
}

function findBestVariant(product: Product, user: User): Variant {
  const { measurements } = user.preferences;

  // Find the variant whose measurements are closest to the user's
  let bestMatch = product.variants[0];
  let bestDiff = Infinity;

  for (const variant of product.variants) {
    const chestDiff = Math.abs(variant.measurements.chest - measurements.chest);
    const lengthDiff = Math.abs(
      variant.measurements.length - measurements.length
    );
    const totalDiff = chestDiff + lengthDiff;

    if (totalDiff < bestDiff) {
      bestDiff = totalDiff;
      bestMatch = variant;
    }
  }

  return bestMatch;
}

function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
}

function calculatePrice(product: Product): PriceBreakdown {
  let subtotal = product.basePrice;
  const discountDetails: { label: string; amount: number }[] = [];

  for (const discount of product.discounts) {
    const amount =
      discount.type === "percentage"
        ? Math.round(subtotal * (discount.value / 100))
        : discount.value;
    discountDetails.push({ label: discount.label, amount });
    subtotal -= amount;
  }

  const tax = Math.round(subtotal * product.taxRate);
  const total = subtotal + product.shippingCost + tax;

  return {
    basePrice: product.basePrice,
    discounts: discountDetails,
    subtotal,
    shipping: product.shippingCost,
    tax,
    total,
  };
}

function buildDeliveryInfo(brandId: string) {
  const brand = brandService.getById(brandId);
  if (!brand)
    return {
      estimatedDate: "Unknown",
      orderByMessage: "",
      onTimeRate: 0,
      badge: "frequently_delayed" as const,
    };

  const { avgDeliveryDays, cutoffHour } = brand.deliveryStats;
  const { rate, badge } = brandService.getDeliveryRate(brand);

  const now = new Date();
  const orderDate = new Date(now);
  if (now.getHours() >= cutoffHour) {
    orderDate.setDate(orderDate.getDate() + 1);
  }

  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + avgDeliveryDays);

  const estimatedDate = deliveryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const cutoffFormatted =
    cutoffHour === 23
      ? "Midnight"
      : cutoffHour > 12
        ? `${cutoffHour - 12} PM`
        : `${cutoffHour} AM`;

  const orderByMessage = `Order before ${cutoffFormatted} today for delivery by ${estimatedDate}`;

  return { estimatedDate, orderByMessage, onTimeRate: rate, badge };
}

function buildSummary(
  availability: ConfidenceResponse["availability"],
  pricing: PriceBreakdown,
  delivery: ConfidenceResponse["delivery"],
  brandName: string
): string {
  const parts: string[] = [];

  if (availability.status === "out_of_stock") {
    parts.push(`Your size ${availability.matchedSize} is out of stock.`);
  } else if (availability.status === "low_stock") {
    parts.push(
      `Available in size ${availability.matchedSize} — only ${availability.stock} left.`
    );
  } else {
    parts.push(`Available in your size ${availability.matchedSize}.`);
  }

  const totalDiscount = pricing.discounts.reduce((s, d) => s + d.amount, 0);
  if (totalDiscount > 0) {
    const pct = Math.round((totalDiscount / pricing.basePrice) * 100);
    parts.push(
      `You'd pay Rs. ${pricing.total.toLocaleString()} (${pct}% off${pricing.shipping === 0 ? " + free shipping" : ""}).`
    );
  } else {
    parts.push(`You'd pay Rs. ${pricing.total.toLocaleString()}.`);
  }

  parts.push(
    `${delivery.orderByMessage}. ${brandName}'s on-time rate is ${delivery.onTimeRate}%.`
  );

  return parts.join(" ");
}

export function getConfidence(
  productId: string,
  user: User
): ConfidenceResponse | null {
  const product = getById(productId);
  if (!product) return null;

  const variant = findBestVariant(product, user);
  const status = getStockStatus(variant.stock);
  const pricing = calculatePrice(product);
  const delivery = buildDeliveryInfo(product.brandId);
  const brand = brandService.getById(product.brandId);

  const availability = {
    status,
    matchedSize: variant.size,
    stock: variant.stock,
    restockDate: variant.restockDate,
  };

  const overBudget = pricing.total > user.preferences.budgetMax;
  const showAlternatives =
    status === "out_of_stock" ||
    overBudget ||
    delivery.badge === "frequently_delayed";

  const summary = buildSummary(
    availability,
    pricing,
    delivery,
    brand?.name ?? "This brand"
  );

  return { availability, pricing, delivery, summary, showAlternatives };
}

export function getAlternatives(
  productId: string,
  user: User
): Alternative[] {
  const product = getById(productId);
  if (!product) return [];

  const candidates = productsData.filter(
    (p) => p.id !== productId && p.category === product.category
  );

  const alternatives: Alternative[] = [];

  for (const candidate of candidates) {
    const variant = findBestVariant(candidate, user);
    if (variant.stock === 0) continue;

    const pricing = calculatePrice(candidate);
    const brand = brandService.getById(candidate.brandId);
    const reasons: string[] = [];

    if (variant.stock > 0) reasons.push("your size in stock");
    if (pricing.total < calculatePrice(product).total)
      reasons.push(`Rs. ${(calculatePrice(product).total - pricing.total).toLocaleString()} less`);
    if (brand) {
      const { badge } = brandService.getDeliveryRate(brand);
      if (badge === "highly_reliable") reasons.push("highly reliable delivery");
    }

    if (reasons.length === 0) reasons.push("similar style");

    alternatives.push({
      product: candidate,
      brandName: brand?.name ?? "",
      reason: reasons.join(", "),
      finalPrice: pricing.total,
    });
  }

  return alternatives;
}
