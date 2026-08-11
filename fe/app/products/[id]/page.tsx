"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Star,
  Zap,
  ShoppingBag,
  Bell,
  ShieldCheck,
  Truck,
  RotateCcw,
  ThumbsUp,
  Plus,
  Minus,
} from "lucide-react";
import type { Product, Brand, ConfidenceResponse, Alternative } from "@/types/types";
import { getProduct, getBrand, getConfidence, getAlternatives } from "@/lib/api";
import { usePreferences } from "@/lib/UserPreferencesContext";
import HeaderNav from "@/components/HeaderNav";
import SidebarNav from "@/components/SidebarNav";
import SizeSelector from "@/components/SizeSelector";
import ConfidenceBanner from "@/components/ConfidenceBanner";
import ConfidenceSignals from "@/components/ConfidenceSignals";
import AlternativeCard from "@/components/AlternativeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const detailsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailsOpen && detailsRef.current) {
      const timer = setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [detailsOpen]);

  useEffect(() => {
    if (reviewsOpen && reviewsRef.current) {
      const timer = setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [reviewsOpen]);

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
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <HeaderNav />
        <div className="mx-auto max-w-7xl w-full px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="aspect-[3/4] max-h-[660px] rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const isOutOfStock = selectedVariant?.stock === 0;

  // Calculate prices
  let finalPrice = product.basePrice;
  for (const d of product.discounts) {
    finalPrice -= d.type === "percentage" ? Math.round(finalPrice * (d.value / 100)) : d.value;
  }
  const discountPct =
    finalPrice < product.basePrice
      ? Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <HeaderNav />
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6">
        {/* Main Content Area */}
        <main className="py-6 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Men
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/" className="hover:text-foreground transition-colors">
              Clothing
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold truncate">{product.category}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Section */}
            <div className="flex gap-4">
              {/* Vertical Thumbnail List */}
              <div className="hidden sm:flex flex-col gap-3">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className="w-16 h-20 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground/40 cursor-pointer hover:border-foreground transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Main Product Image */}
              <div className="flex-1 aspect-[3/4] max-h-[660px] rounded-xl bg-muted border border-border flex flex-col items-center justify-center text-muted-foreground/30 relative overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mt-2">
                  {product.name}
                </span>

                {discountPct > 0 && (
                  <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{discountPct}%
                  </span>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-3">
              {/* Brand Header Row */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-bold text-foreground tracking-wide uppercase">
                    {brand.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-foreground font-bold">4.2</span>
                    <span>• {brand.deliveryStats.totalOrders} Items Sold</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: product.name, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied!");
                      }
                    }}
                    className="p-2 border border-border rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 border border-border rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Title & Rating */}
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">{product.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">4.2</span>
                  <span className="text-muted-foreground">| 18 Reviews</span>
                </div>
              </div>

              {/* Promotional Badges / Tags */}
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700">
                  Azaadi Sale
                </Badge>
                <Badge variant="outline" className="text-[11px] font-semibold border-amber-500 text-amber-700 bg-amber-50">
                  ⚡ Earn 138 points
                </Badge>
              </div>

              {/* SIFT PURCHASE CONFIDENCE PANEL - Placed directly under tags */}
              <div className="space-y-2 pt-1">

                <ConfidenceBanner confidence={confidence} />
                <div className="rounded-xl border border-border p-3 bg-card shadow-sm">
                  <ConfidenceSignals confidence={confidence} />
                </div>
              </div>

              {/* Size Selector */}
              <SizeSelector
                variants={product.variants}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />

              {/* Quantity & Action Buttons - Kept in Viewport */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-foreground">Quantity</span>
                  <div className="flex items-center w-32 h-10 border border-border rounded-xl bg-background overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {isOutOfStock ? (
                    <Button className="w-full gap-2 h-14 text-base font-bold rounded-xl" variant="outline">
                      <Bell className="h-5 w-5" />
                      Notify Me When Available
                    </Button>
                  ) : (
                    <>
                      <Button className="flex-1 h-14 bg-foreground text-background hover:bg-foreground/90 font-bold text-base rounded-xl shadow-sm">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Add To Bag
                      </Button>
                      <Button className="flex-1 h-14 border-2 border-foreground bg-background text-foreground hover:bg-muted font-bold text-base rounded-xl shadow-sm">
                        Buy Now
                      </Button>
                    </>
                  )}
                </div>
              </div>



              {/* Product Details Expandable Accordion */}
              <div ref={detailsRef} className="pt-2 border-t border-border scroll-mt-24">
                <button
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full flex items-center justify-between py-2.5 text-left text-sm font-bold text-foreground hover:text-foreground/80 transition-colors"
                >
                  <span>Product Details</span>
                  {detailsOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {detailsOpen && (
                  <div className="space-y-3 pt-2 pb-1">
                    <div className="border border-border rounded-lg overflow-hidden text-xs">
                      <div className="grid grid-cols-2 divide-x divide-y divide-border">
                        <div className="p-2.5 bg-muted/40 font-semibold text-muted-foreground">Color Type</div>
                        <div className="p-2.5 font-medium">{product.variants[0]?.color || "Standard"}</div>

                        <div className="p-2.5 bg-muted/40 font-semibold text-muted-foreground">Product ID</div>
                        <div className="p-2.5 font-mono">{product.id.toUpperCase()}-2026</div>

                        <div className="p-2.5 bg-muted/40 font-semibold text-muted-foreground">Fabric</div>
                        <div className="p-2.5 font-medium">{product.category.includes("Silk") ? "Pure Silk" : "Premium Wash & Wear"}</div>

                        <div className="p-2.5 bg-muted/40 font-semibold text-muted-foreground">Number of Pieces</div>
                        <div className="p-2.5 font-medium">1 Piece - Kurta</div>

                        <div className="p-2.5 bg-muted/40 font-semibold text-muted-foreground">Season</div>
                        <div className="p-2.5 font-medium">All Season Festive</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                      Disclaimer: Actual product color may vary slightly from the image.
                    </p>
                  </div>
                )}
              </div>



              {/* Ratings & Reviews Expandable Accordion */}
              <div ref={reviewsRef} className="pt-2 border-t border-border scroll-mt-24">
                <button
                  onClick={() => setReviewsOpen(!reviewsOpen)}
                  className="w-full flex items-center justify-between py-2.5 text-left text-sm font-bold text-foreground hover:text-foreground/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Ratings and Reviews</span>
                    <span className="text-xs font-normal text-muted-foreground">(4.2 ★ • 18 ratings)</span>
                  </div>
                  {reviewsOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {reviewsOpen && (
                  <div className="space-y-4 pt-3 pb-1">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-extrabold text-foreground">4.2</p>
                        <div className="flex justify-center text-amber-400 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-[11px] text-muted-foreground">18 ratings</p>
                      </div>
                      <div className="flex-1 space-y-1 text-xs">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="w-3 text-muted-foreground">{rating}</span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-foreground rounded-full"
                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="p-3 border border-border rounded-lg bg-card text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="font-semibold text-foreground">Anonymous User</span>
                          <span>Aug 11, 2026</span>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-foreground">Nice color, good fit and fabric quality is very premium.</p>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-[11px] pt-1">
                          <ThumbsUp className="h-3 w-3" /> Helpful
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alternatives Section */}
              {confidence.showAlternatives && alternatives.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      Recommended Alternatives
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      Matched by size & budget
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {alternatives.map((alt) => (
                      <AlternativeCard key={alt.product.id} alt={alt} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
