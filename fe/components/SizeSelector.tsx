"use client";

import { useState } from "react";
import type { ProductSizes, SizeLabel } from "@/types/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SIZE_LABELS: SizeLabel[] = ["S", "M", "L", "XL", "XXL"];

interface SizeSelectorProps {
  sizes: ProductSizes;
  selectedSize: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  const [chartOpen, setChartOpen] = useState(false);

  // Get all measurement keys from the sizes object
  const measurementKeys = Object.keys(sizes);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Select Size</p>
        <Dialog open={chartOpen} onOpenChange={setChartOpen}>
          <DialogTrigger className="text-xs font-semibold text-foreground underline hover:text-emerald-700 transition-colors">
            Size Chart
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Size Chart (inches)</DialogTitle>
            </DialogHeader>
            <div className="mt-4 border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-2 font-semibold capitalize">Measurement</th>
                    {SIZE_LABELS.map((size) => (
                      <th
                        key={size}
                        className={`p-2 font-semibold text-center ${
                          size === selectedSize ? "bg-emerald-100 text-emerald-800" : ""
                        }`}
                      >
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {measurementKeys.map((key) => (
                    <tr key={key}>
                      <td className="p-2 font-bold capitalize">{key}</td>
                      {SIZE_LABELS.map((size) => (
                        <td
                          key={size}
                          className={`p-2 text-center ${
                            size === selectedSize ? "bg-emerald-50 font-semibold" : ""
                          }`}
                        >
                          {sizes[key][size]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        {SIZE_LABELS.map((size) => {
          const isSelected = size === selectedSize;

          return (
            <div key={size} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onSelect(size)}
                className={`
                  w-12 h-11 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center
                  ${
                    isSelected
                      ? "border-foreground bg-foreground text-background shadow"
                      : "border-border bg-background text-foreground hover:border-foreground/50"
                  }
                `}
              >
                {size}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
