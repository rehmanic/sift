"use client";

import type { Variant } from "@/types/types";

const STOCK_STYLES = {
  in_stock: "border-emerald-300 bg-emerald-50 text-emerald-800",
  low_stock: "border-amber-300 bg-amber-50 text-amber-800",
  out_of_stock: "border-red-200 bg-red-50 text-red-400 cursor-not-allowed",
  selected: "ring-2 ring-foreground ring-offset-2",
};

function getStatus(stock: number) {
  if (stock === 0) return "out_of_stock" as const;
  if (stock <= 5) return "low_stock" as const;
  return "in_stock" as const;
}

interface SizeSelectorProps {
  variants: Variant[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ variants, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Size</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const status = getStatus(v.stock);
          const isSelected = v.size === selectedSize;
          return (
            <button
              key={v.size}
              onClick={() => status !== "out_of_stock" && onSelect(v.size)}
              disabled={status === "out_of_stock"}
              className={`
                relative px-4 py-2 rounded-lg border text-sm font-medium transition-all
                ${STOCK_STYLES[status]}
                ${isSelected ? STOCK_STYLES.selected : ""}
              `}
            >
              {v.size}
              {status === "low_stock" && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-amber-500 text-white rounded-full px-1">
                  {v.stock}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
