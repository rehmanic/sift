import { Product, PriceBreakdown } from "../types/types";


export function calculatePriceBreakdown(product: Product): PriceBreakdown {
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


export function calculateDiscountInfo(product: Product) {
  const breakdown = calculatePriceBreakdown(product);

  const discountPct =
    breakdown.subtotal < product.basePrice
      ? Math.round(((product.basePrice - breakdown.subtotal) / product.basePrice) * 100)
      : 0;

  return {
    finalPrice: breakdown.subtotal,
    discountPct,
  };
}
