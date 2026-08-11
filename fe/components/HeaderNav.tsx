"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { usePreferences } from "@/lib/UserPreferencesContext";
import PreferencesDialog from "@/components/PreferencesDialog";
import { Button } from "@/components/ui/button";

export default function HeaderNav() {
  const { user } = usePreferences();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Topbar Logo using public/logo.png */}
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="LAAM Logo"
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Preferences Button */}
        <PreferencesDialog>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium h-9 border-border">
            <Settings className="h-3.5 w-3.5" />
            <span>Preferences</span>
           
          </Button>
        </PreferencesDialog>
      </div>
    </header>
  );
}
