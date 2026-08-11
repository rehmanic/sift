"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Zap, Bell } from "lucide-react";
import type { Product, Brand, ConfidenceResponse, Alternative } from "@/types/types";
import { getProduct, getBrand, getConfidence, getAlternatives } from "@/lib/api";
import { usePreferences } from "@/lib/UserPreferencesContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import SizeSelector from "@/components/SizeSelector";
import ConfidenceBanner from "@/components/ConfidenceBanner";
import ConfidenceSignals from "@/components/ConfidenceSignals";
import AlternativeCard from "@/components/AlternativeCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { user } = usePreferences();

  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceResponse | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(async (prod) => {
      setProduct(prod);
      const [brandData, confData, altData] = await Promise.all([
        getBrand(prod.brandId),
        getConfidence(prod.id),
        getAlternatives(prod.id),
      ]);
      setBrand(brandData);
      setConfidence(confData);
      setAlternatives(altData);
      setSelectedSize(confData.availability.matchedSize);
      setLoading(false);
    });
  }, [id]);

  // Refresh confidence when user preferences change
  useEffect(() => {
    if (!product || !user) return;
    getConfidence(product.id, user.id).then((confData) => {
      setConfidence(confData);
      setSelectedSize(confData.availability.matchedSize);
    });
    getAlternatives(product.id, user.id).then(setAlternatives);
  }, [user?.preferences, product]);

  if (loading || !product || !brand || !confidence) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const isOutOfStock = selectedVariant?.stock === 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="aspect-[3/4] rounded-xl bg-muted flex items-center justify-center text-muted-foreground/30 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" x2="21" y1="6" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>

        {/* Product Info + Confidence Panel */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
              {brand.name}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <SizeSelector
            variants={product.variants}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
          />

          <Separator />

          {/* Confidence Panel */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Purchase Confidence
            </h2>
            <ConfidenceBanner confidence={confidence} />
            <div className="rounded-xl border border-border p-5">
              <ConfidenceSignals confidence={confidence} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isOutOfStock ? (
              <Button className="flex-1 gap-2" variant="outline">
                <Bell className="h-4 w-4" />
                Notify Me
              </Button>
            ) : (
              <>
                <Button className="flex-1 gap-2" variant="outline">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button className="flex-1 gap-2">
                  <Zap className="h-4 w-4" />
                  Buy Now
                </Button>
              </>
            )}
          </div>

          {/* Alternatives */}
          {confidence.showAlternatives && alternatives.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Alternatives
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alternatives.map((alt) => (
                    <AlternativeCard key={alt.product.id} alt={alt} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
