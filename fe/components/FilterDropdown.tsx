"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : label;
  const isActive = value !== "";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Pill Button — matches PriceFilterDropdown style */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
          isActive || open
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background text-foreground hover:bg-muted"
        }`}
      >
        <span>{isActive ? displayLabel : label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 mt-2 z-50 min-w-[160px] bg-background border border-border rounded-xl shadow-xl py-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* "All" / reset option */}
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between gap-4 ${
              value === ""
                ? "text-foreground font-semibold bg-muted/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <span>{label}</span>
            {value === "" && <Check className="h-3.5 w-3.5 text-foreground" />}
          </button>

          <div className="h-px bg-border mx-2 my-1" />

          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between gap-4 ${
                  isSelected
                    ? "text-foreground font-semibold bg-muted/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-foreground" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
