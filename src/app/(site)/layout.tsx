import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity.queries";
import SiteLayoutClient from "./SiteLayoutClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const SITE_NAME = "Chicbylims";
const SITE_DESCRIPTION =
  "Authentic ready-to-wear African fashion — bold Ankara prints, lace and premium fabrics, designed to make you feel unique and unapologetic.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL in production so OG/canonical URLs resolve absolutely.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: `${SITE_NAME} | Ready to Wear Ankara`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Ready to Wear Ankara`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Ready to Wear Ankara`,
    description: SITE_DESCRIPTION,
  },
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
