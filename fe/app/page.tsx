"use client";

import { useEffect, useState, useMemo } from "react";
import type { Product, Brand, SizeLabel } from "@/types/types";
import { getProducts, getBrand } from "@/lib/api";
import HeaderNav from "@/components/HeaderNav";
import ProductCard from "@/components/ProductCard";
import PriceFilterDropdown from "@/components/PriceFilterDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import { Skeleton } from "@/components/ui/skeleton";

const SIZE_LABELS: SizeLabel[] = ["S", "M", "L", "XL", "XXL"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Record<string, Brand>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(async (prods) => {
        setProducts(prods);
        const uniqueBrandIds = [...new Set(prods.map((p) => p.brandId))];
        const brandResults = await Promise.all(uniqueBrandIds.map(getBrand));
        const brandMap: Record<string, Brand> = {};
        brandResults.forEach((b) => {
          brandMap[b.id] = b;
        });
        setBrands(brandMap);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "Waist Coat",
    "Kurta",
    "Trouser",
    "Kameez",
    "Shalwar",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (
        selectedCategory &&
        !p.category.toLowerCase().includes(selectedCategory.toLowerCase()) &&
        !selectedCategory.toLowerCase().includes(p.category.toLowerCase())
      ) {
        return false;
      }
      // Brand filter
      if (selectedBrand && p.brandId !== selectedBrand) {
        return false;
      }
      // Price filter
      let finalPrice = p.basePrice;
      if (p.discounts && p.discounts.length > 0) {
        for (const d of p.discounts) {
          finalPrice -= d.type === "percentage" ? Math.round(finalPrice * (d.value / 100)) : d.value;
        }
      }
      if (finalPrice < priceRange[0] || finalPrice > priceRange[1]) {
        return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, selectedSize, priceRange]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />

      {/* Main Container - No Sidebar */}
      <main className="mx-auto max-w-7xl w-full flex-1 px-4 sm:px-6 py-6 space-y-6">
        {/* Title and Count */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Men&apos;s Collection
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {filteredProducts.length.toLocaleString()} Items
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === ""
                ? "bg-foreground text-background border-foreground"
                : "bg-muted/50 border-border text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-muted/50 border-border text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Explicit Filter Row: Price, Size, Brand */}
        <div className="flex flex-wrap items-center gap-3 py-3 border-y border-border text-xs">
          {/* 1. Price Filter Popover */}
          <PriceFilterDropdown
            priceRange={priceRange}
            onApply={setPriceRange}
            maxPriceLimit={15000}
          />

          {/* 2. Size Filter */}
          <FilterDropdown
            label="Size: All"
            options={SIZE_LABELS.map((size) => ({ label: size, value: size }))}
            value={selectedSize}
            onChange={setSelectedSize}
          />

          {/* 3. Brand Filter */}
          <FilterDropdown
            label="Brand: All"
            options={Object.values(brands).map((b) => ({ label: b.name, value: b.id }))}
            value={selectedBrand}
            onChange={setSelectedBrand}
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-base font-semibold text-foreground">No matching products found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your selected filters or price range.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                brandName={brands[product.brandId]?.name ?? "LAAM"}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground">
        © 2026 LAAM Sift — Purchase Confidence Engine
      </footer>
    </div>
  );
}
