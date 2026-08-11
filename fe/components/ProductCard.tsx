"use client";

import Link from "next/link";
import type { Product } from "@/types/types";
import { Badge } from "@/components/ui/badge";

function getLowestStockStatus(product: Product) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  if (totalStock === 0) return "out_of_stock" as const;
  if (totalStock <= 5) return "low_stock" as const;
  return "in_stock" as const;
}

function getFinalPrice(product: Product): number {
  let price = product.basePrice;
  for (const d of product.discounts) {
    price -= d.type === "percentage" ? Math.round(price * (d.value / 100)) : d.value;
  }
  return price;
}

const STOCK_CONFIG = {
  in_stock: { label: "In Stock", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  low_stock: { label: "Low Stock", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export default function ProductCard({ product, brandName }: { product: Product; brandName: string }) {
  const status = getLowestStockStatus(product);
  const stockCfg = STOCK_CONFIG[status];
  const finalPrice = getFinalPrice(product);
  const hasDiscount = finalPrice < product.basePrice;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-foreground/20">
        <div className="aspect-[3/4] bg-muted relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <Badge className={`absolute top-3 right-3 ${stockCfg.className}`}>
            {stockCfg.label}
          </Badge>
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground hover:bg-primary">
              Sale
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{brandName}</p>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">
              Rs. {finalPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                Rs. {product.basePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
