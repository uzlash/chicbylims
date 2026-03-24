import { getSiteSettings } from "@/lib/sanity.queries";
import SiteLayoutClient from "./SiteLayoutClient";

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
