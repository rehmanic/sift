"use client";

import Link from "next/link";
import type { Alternative } from "@/types/types";
import { Badge } from "@/components/ui/badge";

export default function AlternativeCard({ alt }: { alt: Alternative }) {
  return (
    <Link href={`/products/${alt.product.id}`}>
      <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-foreground/20 transition-all duration-200 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {alt.brandName}
          </p>
          <Badge variant="secondary" className="text-xs">
            Rs. {alt.finalPrice.toLocaleString()}
          </Badge>
        </div>
        <h4 className="text-sm font-medium leading-snug line-clamp-2">
          {alt.product.name}
        </h4>
        <p className="text-xs text-emerald-700 bg-emerald-50 rounded-md px-2 py-1 inline-block">
          {alt.reason}
        </p>
      </div>
    </Link>
  );
}
