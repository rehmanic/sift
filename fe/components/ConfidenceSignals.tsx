"use client";

import { useState } from "react";
import type { ConfidenceResponse, StockStatus, DeliveryBadge } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

const STOCK_BADGE: Record<StockStatus, { label: string; className: string }> = {
  in_stock: { label: "In Stock", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  low_stock: { label: "Low Stock", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

const DELIVERY_BADGE: Record<DeliveryBadge, { label: string; className: string }> = {
  highly_reliable: { label: "Highly Reliable", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  usually_on_time: { label: "Usually On Time", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  frequently_delayed: { label: "Frequently Delayed", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export default function ConfidenceSignals({ confidence }: { confidence: ConfidenceResponse }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { availability, pricing, delivery } = confidence;
  const stockCfg = STOCK_BADGE[availability.status];
  const deliveryCfg = DELIVERY_BADGE[delivery.badge];

  return (
    <div className="space-y-4">
      {/* Availability */}
      <div className="flex items-start gap-3">
        <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Availability</p>
            <Badge className={stockCfg.className}>{stockCfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Size {availability.matchedSize}
            {availability.status === "low_stock" && ` — only ${availability.stock} left`}
            {availability.status === "out_of_stock" && availability.restockDate &&
              ` — expected restock ${new Date(availability.restockDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            }
          </p>
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="flex items-start gap-3">
        <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">You Pay</p>
            <p className="text-xl font-extrabold text-emerald-700">Rs. {pricing.total.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-0.5 transition-colors"
          >
            {showBreakdown ? "Hide" : "View"} breakdown
            {showBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showBreakdown && (
            <div className="mt-2 text-sm space-y-1 bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base price</span>
                <span>Rs. {pricing.basePrice.toLocaleString()}</span>
              </div>
              {pricing.discounts.map((d, i) => (
                <div key={i} className="flex justify-between text-emerald-700">
                  <span>{d.label}</span>
                  <span>-Rs. {d.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{pricing.shipping === 0 ? "Free" : `Rs. ${pricing.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>Rs. {pricing.tax.toLocaleString()}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {pricing.total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Delivery */}
      <div className="flex items-start gap-3">
        <Truck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Delivery</p>
            <Badge className={deliveryCfg.className}>{deliveryCfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {delivery.orderByMessage}
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-md shadow-xs">
            <span>On-time delivery rate:</span>
            <span className="font-extrabold text-emerald-950">{delivery.onTimeRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
