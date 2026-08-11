"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface PriceFilterDropdownProps {
  priceRange: [number, number];
  onApply: (range: [number, number]) => void;
  maxPriceLimit?: number;
}

export default function PriceFilterDropdown({
  priceRange,
  onApply,
  maxPriceLimit = 15000,
}: PriceFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [tempMin, setTempMin] = useState<number>(priceRange[0]);
  const [tempMax, setTempMax] = useState<number>(priceRange[1]);

  const isFiltered = priceRange[0] > 0 || priceRange[1] < maxPriceLimit;

  const handleApply = () => {
    onApply([tempMin, tempMax]);
    setOpen(false);
  };

  const handleReset = () => {
    setTempMin(0);
    setTempMax(maxPriceLimit);
    onApply([0, maxPriceLimit]);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Pill Button */}
      <button
        onClick={() => {
          setTempMin(priceRange[0]);
          setTempMax(priceRange[1]);
          setOpen(!open);
        }}
        className={`flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
          isFiltered || open
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background text-foreground hover:bg-muted"
        }`}
      >
        <span>Price</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Card */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute left-0 mt-2 z-50 w-80 bg-background border border-border rounded-2xl shadow-xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Price</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Inputs: From & To */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">From</label>
                <input
                  type="number"
                  value={tempMin}
                  onChange={(e) => setTempMin(Number(e.target.value))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">To</label>
                <input
                  type="number"
                  value={tempMax}
                  onChange={(e) => setTempMax(Number(e.target.value))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            {/* Slider */}
            <div className="py-2">
              <Slider
                value={[tempMin, tempMax]}
                onValueChange={(val) => {
                  const [min, max] = val as [number, number];
                  setTempMin(min);
                  setTempMax(max);
                }}
                min={0}
                max={maxPriceLimit}
                step={500}
                className="w-full"
              />
            </div>

            {/* Actions: Reset & Apply */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleReset}
                className="border border-border rounded-lg px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-neutral-900 text-white rounded-lg py-2 text-xs font-bold hover:bg-black transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
