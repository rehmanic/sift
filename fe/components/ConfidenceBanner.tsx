"use client";

import type { ConfidenceResponse } from "@/types/types";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function ConfidenceBanner({ confidence }: { confidence: ConfidenceResponse }) {
  const allGood =
    confidence.availability.status !== "out_of_stock" &&
    !confidence.showAlternatives;

  return (
    <div
      className={`rounded-xl p-4 flex items-start gap-3 ${
        allGood
          ? "bg-emerald-50 border border-emerald-200"
          : "bg-amber-50 border border-amber-200"
      }`}
    >
      {allGood ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
      ) : confidence.availability.status === "out_of_stock" ? (
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
      ) : (
        <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
      )}
      <p
        className={`text-sm leading-relaxed ${
          allGood ? "text-emerald-800" : "text-amber-800"
        }`}
      >
        {confidence.summary}
      </p>
    </div>
  );
}
