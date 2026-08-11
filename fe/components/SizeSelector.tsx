"use client";

import { useState } from "react";
import type { Variant } from "@/types/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [chartOpen, setChartOpen] = useState(false);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Mens Size</p>
        <Dialog open={chartOpen} onOpenChange={setChartOpen}>
          <DialogTrigger className="text-xs font-semibold text-foreground underline hover:text-emerald-700 transition-colors">
            Size Chart
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Brand Size Chart (cm)</DialogTitle>
            </DialogHeader>
            <div className="mt-4 border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-2 font-semibold">Size</th>
                    <th className="p-2 font-semibold">Chest (cm)</th>
                    <th className="p-2 font-semibold">Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {variants.map((v) => (
                    <tr key={v.size} className={v.size === selectedSize ? "bg-emerald-50 font-semibold" : ""}>
                      <td className="p-2 font-bold">{v.size}</td>
                      <td className="p-2">{v.measurements.chest || "N/A"}</td>
                      <td className="p-2">{v.measurements.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const status = getStatus(v.stock);
          const isSelected = v.size === selectedSize;
          const isOutOfStock = status === "out_of_stock";

          return (
            <div key={v.size} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => !isOutOfStock && onSelect(v.size)}
                disabled={isOutOfStock}
                className={`
                  w-12 h-11 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center
                  ${
                    isOutOfStock
                      ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through"
                      : isSelected
                      ? "border-foreground bg-foreground text-background shadow"
                      : "border-border bg-background text-foreground hover:border-foreground/50"
                  }
                `}
              >
                {v.size}
              </button>
              {status === "low_stock" && (
                <span className="text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 rounded px-1 mt-1">
                  {v.stock} left
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
