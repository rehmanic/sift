"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { UserPreferences, User } from "@/types/types";
import { getUser, updatePreferences as updatePrefsApi } from "@/lib/api";

interface PreferencesContextValue {
  user: User | null;
  loading: boolean;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  user: null,
  loading: true,
  updatePreferences: async () => {},
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser("u1")
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>) => {
      if (!user) return;
      const updated = await updatePrefsApi(user.id, prefs);
      setUser(updated);
    },
    [user]
  );

  return (
    <PreferencesContext.Provider value={{ user, loading, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
