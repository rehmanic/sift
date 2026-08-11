export interface Measurements {
  chest: number;
  length: number;
}

export interface Variant {
  size: string;
  color: string;
  stock: number;
  restockDate: string | null;
  measurements: Measurements;
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
  variants: Variant[];
}

export interface DeliveryStats {
  totalOrders: number;
  onTimeOrders: number;
  avgDeliveryDays: number;
  cutoffHour: number;
}

export interface Brand {
  id: string;
  name: string;
  deliveryStats: DeliveryStats;
}

export interface WesternSizePreferences {
  sizeLabel?: string;
  chest: number;
  waist: number;
  hip: number;
  shoulder: number;
}

export interface EasternSizePreferences {
  sizeLabel?: string;
  kameezLength: number;
  chest: number;
  shoulder: number;
  sleeveLength: number;
  trouserLength: number;
}

export interface UserPreferences {
  westernSize: WesternSizePreferences;
  easternSize: EasternSizePreferences;
  paymentType: "card" | "cash" | "ewallet";
  deliveryType: "standard" | "instant";
}

export interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface PriceBreakdown {
  basePrice: number;
  discounts: { label: string; amount: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export type DeliveryBadge = "highly_reliable" | "usually_on_time" | "frequently_delayed";

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
