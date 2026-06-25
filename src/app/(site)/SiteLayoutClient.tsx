"use client";

import { useState, useEffect } from "react";
import { Cormorant_Garamond } from "next/font/google";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnnouncementBar from "@/components/Common/AnnouncementBar";
import Marquee from "@/components/Common/Marquee";

import { ModalProvider } from "../context/QuickViewModalContext";
import { AddToCartModalProvider } from "../context/AddToCartModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import AddToCartModal from "@/components/Common/AddToCartModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import SessionProvider from "@/components/Providers/SessionProvider";
import { BrandProvider } from "../context/BrandContext";
import {
  SiteSettingsProvider,
  type SiteSettingsSnapshot,
} from "../context/SiteSettingsContext";
import { CurrencyProvider } from "../context/CurrencyContext";

type Props = {
  children: React.ReactNode;
  initialSiteSettings: SiteSettingsSnapshot;
};

export default function SiteLayoutClient({
  children,
  initialSiteSettings,
}: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <html
      lang="en"
      className={serif.variable}
      suppressHydrationWarning={true}
    >
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <SessionProvider>
              <BrandProvider>
                <CurrencyProvider>
                  <SiteSettingsProvider
                    initialSettings={initialSiteSettings}
                  >
                    <ReduxProvider>
                      <CartModalProvider>
                        <ModalProvider>
                          <AddToCartModalProvider>
                            <PreviewSliderProvider>
                              <AnnouncementBar />
                              <Marquee />
                              <Header />
                              {children}

                              <QuickViewModal />
                              <AddToCartModal />
                              <CartSidebarModal />
                              <PreviewSliderModal />
                              <Footer />
                            </PreviewSliderProvider>
                          </AddToCartModalProvider>
                        </ModalProvider>
                      </CartModalProvider>
                    </ReduxProvider>
                  </SiteSettingsProvider>
                </CurrencyProvider>
              </BrandProvider>
            </SessionProvider>
            <ScrollToTop />
          </>
        )}
      </body>
    </html>
  );
}
