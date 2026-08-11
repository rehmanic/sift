"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import type { Product, Brand } from "@/types/types";
import { getProducts, getCategories, getBrand } from "@/lib/api";
import { usePreferences } from "@/lib/UserPreferencesContext";
import ProductCard from "@/components/ProductCard";
import PreferencesDialog from "@/components/PreferencesDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { user } = usePreferences();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Record<string, Brand>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: selectedCategory || undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] < 15000 ? priceRange[1] : undefined,
    })
      .then(async (prods) => {
        setProducts(prods);
        const uniqueBrandIds = [...new Set(prods.map((p) => p.brandId))];
        const brandResults = await Promise.all(uniqueBrandIds.map(getBrand));
        const brandMap: Record<string, Brand> = {};
        brandResults.forEach((b) => { brandMap[b.id] = b; });
        setBrands(brandMap);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, priceRange]);

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
          <h1 className="text-lg font-semibold tracking-tight">Sift</h1>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.name} · Size {user.preferences.sizeLabel}
              </span>
            )}
            <PreferencesDialog>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="h-3.5 w-3.5" />
                Preferences
              </Button>
            </PreferencesDialog>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl w-full flex-1 px-6 py-8">
        <div className="space-y-1 mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Discover</h2>
          <p className="text-muted-foreground">
            South Asian fashion — curated for confidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ""
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-2" />

          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Rs. {priceRange[0].toLocaleString()} – {priceRange[1].toLocaleString()}
            </span>
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              min={0}
              max={15000}
              step={500}
              className="w-40"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                brandName={brands[product.brandId]?.name ?? ""}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Sift by LAAM — Purchase with confidence
      </footer>
    </div>
  );
}
