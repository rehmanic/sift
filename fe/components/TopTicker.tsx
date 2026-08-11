"use client";

import { Truck, Sparkles } from "lucide-react";

export default function TopTicker() {
  return (
    <div className="bg-black text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide">
      <Truck className="h-3.5 w-3.5 text-amber-400" />
      <span>FREE Shipping on App</span>
      <span className="opacity-50">|</span>
      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
      <span>30% Cashback via Easypaisa</span>
    </div>
  );
}
