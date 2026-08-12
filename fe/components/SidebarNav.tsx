"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Tag } from "lucide-react";

interface SidebarNavProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function SidebarNav({ activeCategory, onSelectCategory }: SidebarNavProps) {
  const [menOpen, setMenOpen] = useState(true);
  const [womenOpen, setWomenOpen] = useState(false);

  const mainCategories = [
    { label: "All", value: "" },
    { label: "New In", value: "New In" },
  ];

  const menSub = ["Waist Coat", "Kurta", "Trouser", "Kameez", "Shalwar"];

  const secondaryNav = [
    "Beauty",
    "Kids",
    "West",
    "Jewellery",
    "Brands",
    "Top Curations",
    "Orders",
    "Rewards",
    "Wishlist",
    "Become a Seller",
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-border pr-4 hidden lg:block py-6 space-y-6 text-sm">
      <div className="space-y-1">
        {mainCategories.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelectCategory(item.value)}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === item.value
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Women Accordion */}
      <div className="space-y-1">
        <button
          onClick={() => setWomenOpen(!womenOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
        >
          <span>Women</span>
          {womenOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {womenOpen && (
          <div className="pl-4 space-y-1 text-xs">
            {["Unstitched", "Pret", "Lawn", "Chiffon"].map((sub) => (
              <button
                key={sub}
                onClick={() => onSelectCategory(sub)}
                className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                  activeCategory === sub
                    ? "font-semibold text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Men Accordion */}
      <div className="space-y-1">
        <button
          onClick={() => setMenOpen(!menOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <span>Men</span>
          {menOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {menOpen && (
          <div className="pl-4 space-y-1 text-xs">
            {menSub.map((sub) => (
              <button
                key={sub}
                onClick={() => onSelectCategory(sub)}
                className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                  activeCategory === sub
                    ? "font-bold text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Secondary Items */}
      <div className="border-t border-border pt-4 space-y-1">
        {secondaryNav.map((item) => (
          <button
            key={item}
            onClick={() => {
              if (item === "Brands") onSelectCategory("");
            }}
            className="w-full text-left px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-between"
          >
            <span>{item}</span>
            {item === "Rewards" && <Tag className="h-3 w-3 text-amber-500" />}
          </button>
        ))}
      </div>
    </aside>
  );
}
