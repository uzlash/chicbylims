import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity.queries";
import SiteLayoutClient from "./SiteLayoutClient";

export const metadata: Metadata = {
  icons: {
    icon: "/chibylims_favicon.png",
    apple: "/chibylims_favicon.png",
  },
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const initialSiteSettings = {
    contactPhone: settings?.contactPhone ?? null,
    contactEmail: settings?.contactEmail ?? null,
    address: settings?.address ?? null,
  };

  return (
    <SiteLayoutClient initialSiteSettings={initialSiteSettings}>
      {children}
    </SiteLayoutClient>
  );
}
