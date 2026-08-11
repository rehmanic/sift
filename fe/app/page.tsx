"use client";

import { useEffect, useState, useMemo } from "react";
import type { Product, Brand } from "@/types/types";
import { getProducts, getBrand } from "@/lib/api";
import HeaderNav from "@/components/HeaderNav";
import ProductCard from "@/components/ProductCard";
import PriceFilterDropdown from "@/components/PriceFilterDropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Record<string, Brand>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
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
    "Shalwar Kameez",
    "Kurta set",
    "Sherwani",
    "Prince coat",
    "Unstitched",
    "Kurta",
    "Shalwar",
    "Trousers",
  ];

  // Dynamically extract colors from products
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.color) colors.add(v.color);
      });
    });
    return Array.from(colors);
  }, [products]);

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
      // Size filter
      if (
        selectedSize &&
        !p.variants.some((v) => v.size === selectedSize && (inStockOnly ? v.stock > 0 : true))
      ) {
        return false;
      }
      // Color filter
      if (
        selectedColor &&
        !p.variants.some((v) => v.color.toLowerCase() === selectedColor.toLowerCase())
      ) {
        return false;
      }
      // In-stock filter
      if (inStockOnly && !p.variants.some((v) => v.stock > 0)) {
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
  }, [products, selectedCategory, selectedBrand, selectedSize, selectedColor, inStockOnly, priceRange]);

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

        {/* Categories Pills: Shalwar Kameez, Kurta set, Sherwani, Prince coat, Unstitched, Kurta, Shalwar, Trousers */}
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

        {/* Explicit Filter Row: In-stock, Price, Size, Brand, Color */}
        <div className="flex flex-wrap items-center gap-3 py-3 border-y border-border text-xs">
          {/* 1. In-stock Filter */}
          <label className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 cursor-pointer hover:bg-muted transition-colors">
            <span className="font-semibold text-foreground">In-stock</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-foreground rounded cursor-pointer h-3.5 w-3.5"
            />
          </label>

          {/* 2. Price Filter Popover */}
          <PriceFilterDropdown
            priceRange={priceRange}
            onApply={setPriceRange}
            maxPriceLimit={15000}
          />

          {/* 3. Size Filter */}
          <div className="relative inline-block">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="appearance-none bg-background border border-border rounded-md px-3 py-1.5 pr-7 text-xs font-semibold cursor-pointer focus:outline-none focus:border-foreground"
            >
              <option value="">Size: All</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
            <ChevronDown className="h-3 w-3 absolute right-2 top-2.5 pointer-events-none text-muted-foreground" />
          </div>

          {/* 4. Brand Filter */}
          <div className="relative inline-block">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="appearance-none bg-background border border-border rounded-md px-3 py-1.5 pr-7 text-xs font-semibold cursor-pointer focus:outline-none focus:border-foreground"
            >
              <option value="">Brand: All</option>
              {Object.values(brands).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 absolute right-2 top-2.5 pointer-events-none text-muted-foreground" />
          </div>

          {/* 5. Color Filter */}
          <div className="relative inline-block">
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="appearance-none bg-background border border-border rounded-md px-3 py-1.5 pr-7 text-xs font-semibold cursor-pointer focus:outline-none focus:border-foreground"
            >
              <option value="">Color: All</option>
              {availableColors.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 absolute right-2 top-2.5 pointer-events-none text-muted-foreground" />
          </div>
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
