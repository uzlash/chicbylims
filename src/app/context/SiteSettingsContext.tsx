"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useBrand } from "./BrandContext";

export type SiteSettingsSnapshot = {
  contactPhone: string | null;
  contactEmail: string | null;
  address: string | null;
};

type SiteSettings = SiteSettingsSnapshot;

const SiteSettingsContext = createContext<SiteSettings>({
  contactPhone: null,
  contactEmail: null,
  address: null,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

type ProviderProps = {
  children: React.ReactNode;
  /** From RSC layout so footer contact is correct before client fetch (e.g. return from payment gateways). */
  initialSettings?: SiteSettingsSnapshot | null;
};

export const SiteSettingsProvider = ({
  children,
  initialSettings,
}: ProviderProps) => {
  const { brand } = useBrand();
  const seed = initialSettings ?? {
    contactPhone: null,
    contactEmail: null,
    address: null,
  };
  const [contactPhone, setContactPhone] = useState<string | null>(
    seed.contactPhone,
  );
  const [contactEmail, setContactEmail] = useState<string | null>(
    seed.contactEmail,
  );
  const [address, setAddress] = useState<string | null>(seed.address);

  useEffect(() => {
    const slug = brand || "fabrics";
    let cancelled = false;

    const load = () => {
      fetch(`/api/site-settings?brand=${encodeURIComponent(slug)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`site-settings ${res.status}`);
          const data: unknown = await res.json();
          return data as SiteSettingsSnapshot;
        })
        .then((data) => {
          if (cancelled) return;
          setContactPhone(data?.contactPhone ?? null);
          setContactEmail(data?.contactEmail ?? null);
          setAddress(data?.address ?? null);
        })
        .catch(() => {
          // Keep server-hydrated or last-good values; avoid blanking footer after gateway redirects.
        });
    };

    load();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) load();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [brand]);

  return (
    <SiteSettingsContext.Provider value={{ contactPhone, contactEmail, address }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
