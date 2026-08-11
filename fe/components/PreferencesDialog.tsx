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
import type { UserPreferences, WesternSizePreferences, EasternSizePreferences } from "@/types/types";
import { Shirt, Scissors, CreditCard } from "lucide-react";

const PAYMENT_TYPES = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "cash", label: "Cash on Delivery (COD)" },
  { value: "ewallet", label: "E-Wallet (JazzCash / EasyPaisa)" },
];
const DELIVERY_TYPES = [
  { value: "standard", label: "Standard Delivery (2-3 Days)" },
  { value: "instant", label: "Instant / Express Delivery" },
];

const defaultWestern: WesternSizePreferences = {
  chest: 34,
  waist: 28,
  hip: 36,
  shoulder: 14.5,
};

const defaultEastern: EasternSizePreferences = {
  kameezLength: 39,
  chest: 36,
  shoulder: 14,
  sleeveLength: 21.5,
  trouserLength: 38,
};

export default function PreferencesDialog({ children }: { children: React.ReactNode }) {
  const { user, updatePreferences } = usePreferences();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"western" | "eastern" | "payment">("western");

  const [form, setForm] = useState<Partial<UserPreferences>>({});

  const prefs = user?.preferences;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setForm({
        westernSize: prefs?.westernSize ? { ...prefs.westernSize } : { ...defaultWestern },
        easternSize: prefs?.easternSize ? { ...prefs.easternSize } : { ...defaultEastern },
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

  const updateWestern = (key: keyof WesternSizePreferences, val: any) => {
    setForm((prev) => ({
      ...prev,
      westernSize: {
        ...(prev.westernSize || defaultWestern),
        [key]: val,
      },
    }));
  };

  const updateEastern = (key: keyof EasternSizePreferences, val: any) => {
    setForm((prev) => ({
      ...prev,
      easternSize: {
        ...(prev.easternSize || defaultEastern),
        [key]: val,
      },
    }));
  };

  const western = form.westernSize || defaultWestern;
  const eastern = form.easternSize || defaultEastern;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Shopping & Fit Preferences</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Configure your exact body & garment measurements. Best size tags are determined automatically by comparing your measurements against each product's size chart.
          </p>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mt-2 space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab("western")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "western"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shirt className="h-4 w-4" />
            Western Sizes
          </button>
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
          {/* TAB 1: WESTERN CLOTHES SIZES */}
          {activeTab === "western" && (
            <div className="space-y-6 text-sm">
              <div>
                <p className="font-semibold text-foreground mb-3 text-sm">Body / Garment Measurements (in inches)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Chest / Bust</label>
                    <input
                      type="number"
                      value={western.chest ?? 34}
                      onChange={(e) => updateWestern("chest", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Waist</label>
                    <input
                      type="number"
                      value={western.waist ?? 28}
                      onChange={(e) => updateWestern("waist", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Hip</label>
                    <input
                      type="number"
                      value={western.hip ?? 36}
                      onChange={(e) => updateWestern("hip", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Shoulder Width</label>
                    <input
                      type="number"
                      step="0.5"
                      value={western.shoulder ?? 14.5}
                      onChange={(e) => updateWestern("shoulder", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EASTERN CLOTHES SIZES */}
          {activeTab === "eastern" && (
            <div className="space-y-6 text-sm">
              <div>
                <p className="font-semibold text-foreground mb-3 text-sm">Suit / Kameez / Trouser Size Chart (in inches)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Shirt / Kameez Length</label>
                    <input
                      type="number"
                      value={eastern.kameezLength ?? 39}
                      onChange={(e) => updateEastern("kameezLength", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Chest / Bust</label>
                    <input
                      type="number"
                      value={eastern.chest ?? 36}
                      onChange={(e) => updateEastern("chest", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Shoulder</label>
                    <input
                      type="number"
                      step="0.5"
                      value={eastern.shoulder ?? 14}
                      onChange={(e) => updateEastern("shoulder", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Sleeve Length</label>
                    <input
                      type="number"
                      step="0.5"
                      value={eastern.sleeveLength ?? 21.5}
                      onChange={(e) => updateEastern("sleeveLength", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Trouser / Shalwar Length</label>
                    <input
                      type="number"
                      value={eastern.trouserLength ?? 38}
                      onChange={(e) => updateEastern("trouserLength", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT & DELIVERY */}
          {activeTab === "payment" && (
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <label className="font-semibold text-foreground text-sm">Payment Method</label>
                <Select
                  value={form.paymentType ?? "card"}
                  onValueChange={(v) => setForm({ ...form, paymentType: v as UserPreferences["paymentType"] })}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-foreground text-sm">Delivery Speed</label>
                <Select
                  value={form.deliveryType ?? "standard"}
                  onValueChange={(v) => setForm({ ...form, deliveryType: v as UserPreferences["deliveryType"] })}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_TYPES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
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
