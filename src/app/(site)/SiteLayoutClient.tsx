"use client";

import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
    <html lang="en" suppressHydrationWarning={true}>
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
