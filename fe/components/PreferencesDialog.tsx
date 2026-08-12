"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/lib/UserPreferencesContext";
import type {
  UserPreferences,
  EasternSizePreferences,
  WaistCoatSize,
  KurtaSize,
  TrouserSize,
  KameezSize,
  ShalwarSize,
} from "@/types/types";
import { Scissors, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Payment & Delivery Options                                          */
/* ------------------------------------------------------------------ */

const PAYMENT_TYPES = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "easypaisa", label: "Easypaisa" },
];

const DELIVERY_TYPES = [
  { value: "standard", label: "Standard" },
  { value: "instant", label: "Instant" },
];

/* ------------------------------------------------------------------ */
/* Default Values                                                      */
/* ------------------------------------------------------------------ */

const defaultWaistCoat: WaistCoatSize = {
  ban: 17.5,
  chest: 21,
  hips: 21,
  shoulder: 17,
  waist: 20,
  "waistcoat length": 29,
};

const defaultKurta: KurtaSize = {
  ban: 17.5,
  chest: 24,
  collar: 16,
  length: 41,
  shoulder: 18.5,
  "sleeve length": 24,
};

const defaultTrouser: TrouserSize = {
  length: 41,
};

const defaultKameez: KameezSize = {
  ban: 17.5,
  chest: 24,
  collar: 16,
  length: 41,
  shoulder: 18.5,
  "sleeve length": 24,
};

const defaultShalwar: ShalwarSize = {
  length: 41,
};

const defaultEastern: EasternSizePreferences = {
  waistCoat: { ...defaultWaistCoat },
  kurta: { ...defaultKurta },
  trouser: { ...defaultTrouser },
  kameez: { ...defaultKameez },
  shalwar: { ...defaultShalwar },
};

/* ------------------------------------------------------------------ */
/* Helper: Measurement Input Field (Strict 2-Word Labels)             */
/* ------------------------------------------------------------------ */

function MeasurementInput({
  label,
  value,
  onChange,
  step = 0.5,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring pr-14 font-medium"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
          inches
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper: Category Accordion Section                                  */
/* ------------------------------------------------------------------ */

function CategorySection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border bg-background">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function PreferencesDialog({ children }: { children: React.ReactNode }) {
  const { user, updatePreferences } = usePreferences();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"eastern" | "payment">("eastern");
  const [expandedCategory, setExpandedCategory] = useState<string>("waistCoat");

  const [form, setForm] = useState<Partial<UserPreferences>>({});

  const prefs = user?.preferences;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setForm({
        easternSize: prefs?.easternSize
          ? JSON.parse(JSON.stringify(prefs.easternSize))
          : JSON.parse(JSON.stringify(defaultEastern)),
        paymentType: prefs?.paymentType ?? "card",
        deliveryType: prefs?.deliveryType ?? "standard",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences(form);
    setSaving(false);
    setOpen(false);
  };

  /* --- Eastern size updaters --- */

  const eastern = form.easternSize || defaultEastern;

  const updateCategoryField = (
    category: keyof EasternSizePreferences,
    field: string,
    value: number
  ) => {
    setForm((prev) => {
      const currentEastern = prev.easternSize || { ...defaultEastern };
      const currentCat = currentEastern[category] as Record<string, number>;
      return {
        ...prev,
        easternSize: {
          ...currentEastern,
          [category]: {
            ...currentCat,
            [field]: value,
          },
        },
      };
    });
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? "" : cat);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Shopping Preferences</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Configure your garment measurements and shopping options.
          </p>
        </DialogHeader>

        {/* Tab Navigation — 2 tabs only */}
        <div className="flex border-b border-border mt-2 space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab("eastern")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "eastern"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scissors className="h-4 w-4" />
            Eastern Sizes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payment")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "payment"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Payment & Delivery
          </button>
        </div>

        <div className="py-4">
          {/* TAB 1: EASTERN SIZES — per-category accordions */}
          {activeTab === "eastern" && (
            <div className="space-y-3">
              {/* Waist Coat */}
              <CategorySection
                title="Waist Coat"
                isOpen={expandedCategory === "waistCoat"}
                onToggle={() => toggleCategory("waistCoat")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <MeasurementInput
                    label="Ban Size"
                    value={eastern.waistCoat?.ban ?? defaultWaistCoat.ban}
                    onChange={(v) => updateCategoryField("waistCoat", "ban", v)}
                  />
                  <MeasurementInput
                    label="Chest Size"
                    value={eastern.waistCoat?.chest ?? defaultWaistCoat.chest}
                    onChange={(v) => updateCategoryField("waistCoat", "chest", v)}
                  />
                  <MeasurementInput
                    label="Hips Size"
                    value={eastern.waistCoat?.hips ?? defaultWaistCoat.hips}
                    onChange={(v) => updateCategoryField("waistCoat", "hips", v)}
                  />
                  <MeasurementInput
                    label="Shoulder Width"
                    value={eastern.waistCoat?.shoulder ?? defaultWaistCoat.shoulder}
                    onChange={(v) => updateCategoryField("waistCoat", "shoulder", v)}
                  />
                  <MeasurementInput
                    label="Waist Size"
                    value={eastern.waistCoat?.waist ?? defaultWaistCoat.waist}
                    onChange={(v) => updateCategoryField("waistCoat", "waist", v)}
                  />
                  <MeasurementInput
                    label="Waistcoat Length"
                    value={eastern.waistCoat?.["waistcoat length"] ?? defaultWaistCoat["waistcoat length"]}
                    onChange={(v) => updateCategoryField("waistCoat", "waistcoat length", v)}
                  />
                </div>
              </CategorySection>

              {/* Kurta */}
              <CategorySection
                title="Kurta"
                isOpen={expandedCategory === "kurta"}
                onToggle={() => toggleCategory("kurta")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <MeasurementInput
                    label="Ban Size"
                    value={eastern.kurta?.ban ?? defaultKurta.ban}
                    onChange={(v) => updateCategoryField("kurta", "ban", v)}
                  />
                  <MeasurementInput
                    label="Chest Size"
                    value={eastern.kurta?.chest ?? defaultKurta.chest}
                    onChange={(v) => updateCategoryField("kurta", "chest", v)}
                  />
                  <MeasurementInput
                    label="Collar Size"
                    value={eastern.kurta?.collar ?? defaultKurta.collar}
                    onChange={(v) => updateCategoryField("kurta", "collar", v)}
                  />
                  <MeasurementInput
                    label="Kurta Length"
                    value={eastern.kurta?.length ?? defaultKurta.length}
                    onChange={(v) => updateCategoryField("kurta", "length", v)}
                  />
                  <MeasurementInput
                    label="Shoulder Width"
                    value={eastern.kurta?.shoulder ?? defaultKurta.shoulder}
                    onChange={(v) => updateCategoryField("kurta", "shoulder", v)}
                  />
                  <MeasurementInput
                    label="Sleeve Length"
                    value={eastern.kurta?.["sleeve length"] ?? defaultKurta["sleeve length"]}
                    onChange={(v) => updateCategoryField("kurta", "sleeve length", v)}
                  />
                </div>
              </CategorySection>

              {/* Trouser */}
              <CategorySection
                title="Trouser"
                isOpen={expandedCategory === "trouser"}
                onToggle={() => toggleCategory("trouser")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <MeasurementInput
                    label="Trouser Length"
                    value={eastern.trouser?.length ?? defaultTrouser.length}
                    onChange={(v) => updateCategoryField("trouser", "length", v)}
                  />
                </div>
              </CategorySection>

              {/* Kameez */}
              <CategorySection
                title="Kameez"
                isOpen={expandedCategory === "kameez"}
                onToggle={() => toggleCategory("kameez")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <MeasurementInput
                    label="Ban Size"
                    value={eastern.kameez?.ban ?? defaultKameez.ban}
                    onChange={(v) => updateCategoryField("kameez", "ban", v)}
                  />
                  <MeasurementInput
                    label="Chest Size"
                    value={eastern.kameez?.chest ?? defaultKameez.chest}
                    onChange={(v) => updateCategoryField("kameez", "chest", v)}
                  />
                  <MeasurementInput
                    label="Collar Size"
                    value={eastern.kameez?.collar ?? defaultKameez.collar}
                    onChange={(v) => updateCategoryField("kameez", "collar", v)}
                  />
                  <MeasurementInput
                    label="Kameez Length"
                    value={eastern.kameez?.length ?? defaultKameez.length}
                    onChange={(v) => updateCategoryField("kameez", "length", v)}
                  />
                  <MeasurementInput
                    label="Shoulder Width"
                    value={eastern.kameez?.shoulder ?? defaultKameez.shoulder}
                    onChange={(v) => updateCategoryField("kameez", "shoulder", v)}
                  />
                  <MeasurementInput
                    label="Sleeve Length"
                    value={eastern.kameez?.["sleeve length"] ?? defaultKameez["sleeve length"]}
                    onChange={(v) => updateCategoryField("kameez", "sleeve length", v)}
                  />
                </div>
              </CategorySection>

              {/* Shalwar */}
              <CategorySection
                title="Shalwar"
                isOpen={expandedCategory === "shalwar"}
                onToggle={() => toggleCategory("shalwar")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <MeasurementInput
                    label="Shalwar Length"
                    value={eastern.shalwar?.length ?? defaultShalwar.length}
                    onChange={(v) => updateCategoryField("shalwar", "length", v)}
                  />
                </div>
              </CategorySection>
            </div>
          )}

          {/* TAB 2: PAYMENT & DELIVERY */}
          {activeTab === "payment" && (
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Payment Method</label>
                <Select
                  value={form.paymentType ?? "card"}
                  onValueChange={(v) => setForm({ ...form, paymentType: v as any })}
                >
                  <SelectTrigger className="h-10 text-sm font-medium">
                    <SelectValue placeholder="Select payment">
                      {(val) => PAYMENT_TYPES.find((p) => p.value === val)?.label || val}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map((p) => (
                      <SelectItem key={p.value} value={p.value} label={p.label}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Delivery Speed</label>
                <Select
                  value={form.deliveryType ?? "standard"}
                  onValueChange={(v) => setForm({ ...form, deliveryType: v as any })}
                >
                  <SelectTrigger className="h-10 text-sm font-medium">
                    <SelectValue placeholder="Select delivery">
                      {(val) => DELIVERY_TYPES.find((d) => d.value === val)?.label || val}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_TYPES.map((d) => (
                      <SelectItem key={d.value} value={d.value} label={d.label}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
          <Button variant="outline" className="h-10 px-5 text-sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="h-10 px-5 text-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
