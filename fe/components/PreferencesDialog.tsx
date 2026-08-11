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
import { Separator } from "@/components/ui/separator";
import { usePreferences } from "@/lib/UserPreferencesContext";
import type { UserPreferences } from "@/types/types";

const SIZES = ["XS", "S", "M", "L", "XL"];
const PAYMENT_TYPES = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash on Delivery" },
  { value: "ewallet", label: "E-Wallet" },
];
const DELIVERY_TYPES = [
  { value: "standard", label: "Standard" },
  { value: "instant", label: "Instant" },
];

export default function PreferencesDialog({ children }: { children: React.ReactNode }) {
  const { user, updatePreferences } = usePreferences();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<UserPreferences>>({});

  const prefs = user?.preferences;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && prefs) {
      setForm({
        sizeLabel: prefs.sizeLabel,
        paymentType: prefs.paymentType,
        deliveryType: prefs.deliveryType,
        budgetMax: prefs.budgetMax,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences(form);
    setSaving(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Size</label>
            <Select
              value={form.sizeLabel ?? ""}
              onValueChange={(v) => setForm({ ...form, sizeLabel: v ?? undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Select
              value={form.paymentType ?? ""}
              onValueChange={(v) => setForm({ ...form, paymentType: (v ?? undefined) as UserPreferences["paymentType"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Type</label>
            <Select
              value={form.deliveryType ?? ""}
              onValueChange={(v) => setForm({ ...form, deliveryType: (v ?? undefined) as UserPreferences["deliveryType"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery" />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_TYPES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Max (Rs.)</label>
            <input
              type="number"
              value={form.budgetMax ?? ""}
              onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
              min={0}
              step={500}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
