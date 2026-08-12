/** Size values per label (S, M, L, XL, XXL) in inches */
export interface SizeValues {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

/**
 * Product sizes — each key is a measurement name (e.g. "ban", "chest",
 * "waistcoat length") and maps to per-size values.
 */
export interface ProductSizes {
  ban: SizeValues;
  chest: SizeValues;
  hips: SizeValues;
  shoulder: SizeValues;
  waist: SizeValues;
  [key: string]: SizeValues; // allows category-specific length keys
}

export interface Discount {
  type: "percentage" | "fixed";
  value: number;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brandId: string;
  basePrice: number;
  images: string[];
  discounts: Discount[];
  shippingCost: number;
  taxRate: number;
  sizes: ProductSizes;
}

export interface Brand {
  id: string;
  name: string;
  deliveryStats: {
    totalOrders: number;
    onTimeOrders: number;
    avgDeliveryDays: number;
    cutoffHour: number;
  };
}

export interface WaistCoatSize {
  ban: number;
  chest: number;
  hips: number;
  shoulder: number;
  waist: number;
  "waistcoat length": number;
}

export interface KurtaSize {
  ban: number;
  chest: number;
  collar: number;
  length: number;
  shoulder: number;
  "sleeve length": number;
}

export interface TrouserSize {
  length: number;
}

export interface KameezSize {
  ban: number;
  chest: number;
  collar: number;
  length: number;
  shoulder: number;
  "sleeve length": number;
}

export interface ShalwarSize {
  length: number;
}

export interface EasternSizePreferences {
  waistCoat: WaistCoatSize;
  kurta: KurtaSize;
  trouser: TrouserSize;
  kameez: KameezSize;
  shalwar: ShalwarSize;
}

export interface UserPreferences {
  easternSize: EasternSizePreferences;
  paymentType: "card" | "cash" | "ewallet" | "bank_transfer" | string;
  deliveryType: "standard" | "express" | "instant" | string;
}

export interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type SizeLabel = "S" | "M" | "L" | "XL" | "XXL";
export type DeliveryBadge = "highly_reliable" | "usually_on_time" | "frequently_delayed";

export interface PriceBreakdown {
  basePrice: number;
  discounts: { label: string; amount: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface ConfidenceResponse {
  availability: {
    status: StockStatus;
    matchedSize: string;
    stock: number;
    restockDate: string | null;
  };
  pricing: PriceBreakdown;
  delivery: {
    estimatedDate: string;
    orderByMessage: string;
    onTimeRate: number;
    badge: DeliveryBadge;
  };
  summary: string;
  showAlternatives: boolean;
}

export interface Alternative {
  product: Product;
  brandName: string;
  reason: string;
  finalPrice: number;
}
