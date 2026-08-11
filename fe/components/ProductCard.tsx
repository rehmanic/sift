"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
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

function getDiscountPercentage(product: Product): number {
  const finalPrice = getFinalPrice(product);
  if (finalPrice >= product.basePrice) return 0;
  return Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100);
}

export default function ProductCard({
  product,
  brandName,
}: {
  product: Product;
  brandName: string;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const status = getLowestStockStatus(product);
  const finalPrice = getFinalPrice(product);
  const discountPct = getDiscountPercentage(product);
  const hasDiscount = discountPct > 0;

  return (
    <div className="group relative flex flex-col bg-card rounded-lg overflow-hidden border border-border/70 hover:border-foreground/20 hover:shadow-md transition-all duration-200">
      {/* Image Block */}
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-muted-foreground/30 group-hover:scale-105 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="54"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-[11px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        </Link>

        {/* Top-Left Discount Badge */}
        {hasDiscount ? (
          <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            -{discountPct}%
          </span>
        ) : (
          status === "out_of_stock" && (
            <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              Out of Stock
            </span>
          )
        )}

        {/* Top-Right Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Add to wishlist"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur text-foreground hover:scale-110 transition-transform shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Bottom-Right Floating Cart Button */}
        <Link
          href={`/products/${product.id}`}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white text-foreground shadow hover:bg-foreground hover:text-background transition-colors"
          title="View & Add to Bag"
        >
          <ShoppingBag className="h-4 w-4" />
        </Link>
      </div>

      {/* Product Details Block */}
      <div className="p-3 flex flex-col justify-between flex-1 space-y-1.5">
        {/* Price Row */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-sm text-emerald-700">
            PKR {finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              PKR {product.basePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Brand & Product Title */}
        <Link href={`/products/${product.id}`} className="block">
          <p className="text-xs font-semibold text-foreground/90 truncate">
            {brandName} <span className="text-muted-foreground font-normal">• {product.name}</span>
          </p>
        </Link>

        {/* Ratings & Event Tag */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>4.2</span>
            <span className="text-muted-foreground text-[10px]">(18)</span>
          </div>

          <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-emerald-600 text-emerald-700 font-semibold bg-emerald-50">
            Azaadi Sale
          </Badge>
        </div>
      </div>
    </div>
  );
}
