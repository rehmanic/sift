import brands from "../data/brands.json";
import { Brand, DeliveryBadge } from "../types";

const brandsData = brands as Brand[];

export function getById(id: string): Brand | undefined {
  return brandsData.find((b) => b.id === id);
}

export function getDeliveryRate(brand: Brand): {
  rate: number;
  badge: DeliveryBadge;
} {
  const { totalOrders, onTimeOrders } = brand.deliveryStats;
  const rate = Math.round((onTimeOrders / totalOrders) * 100);

  let badge: DeliveryBadge = "frequently_delayed";
  if (rate >= 90) badge = "highly_reliable";
  else if (rate >= 70) badge = "usually_on_time";

  return { rate, badge };
}
