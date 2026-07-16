"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Best Sellers", href: "/shop?category=best-sellers" },
  { label: "Dresses", href: "/shop?category=dresses" },
  { label: "Matching Sets", href: "/shop?category=matching-sets" },
  { label: "Menswear", href: "/shop?category=men" },
  { label: "Headpieces", href: "/shop?category=headpieces" },
  { label: "Final Clearance", href: "/shop?category=clearance" },
];

const INFO_LINKS = [
  { label: "Sizing Chart", href: "/contact" },
  { label: "Shipping & Returns", href: "/contact" },
  { label: "Return an Item", href: "/contact" },
  { label: "About Us", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "FAQs", href: "/contact" },
];

const TRUST = [
  { title: "Guaranteed Fast Shipping", note: "Delivered within 24hrs in Abuja" },
  { title: "24/7 Customer Support", note: "We're here whenever you need us" },
  { title: "4.9 Customer Rating", note: "Loved by 600+ happy customers" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const { contactPhone, contactEmail, address } = useSiteSettings();

  return (
    <footer className="mt-20 xl:mt-28">
      {/* Trust strip */}
      <div className="border-y border-cream-dark bg-cream">
        <div className="section-container grid grid-cols-1 gap-6 py-8 text-center sm:grid-cols-3 sm:text-left">
          {TRUST.map((t) => (
            <div key={t.title}>
              <p className="text-custom-sm font-medium uppercase tracking-[0.12em] text-dark">
                {t.title}
              </p>
              <p className="mt-1 text-custom-sm text-body">{t.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container">
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 xl:py-20">
          {/* Brand / story */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-serif text-2xl font-semibold uppercase tracking-[0.25em] text-dark"
            >
              Chicbylims
            </Link>
            <p className="mt-5 max-w-[340px] text-custom-sm leading-relaxed text-body">
              Authentic ready-to-wear African fashion — bold prints and premium fabrics
              designed to make you feel unique and unapologetic.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 text-custom-sm text-body">
              {address && <li>{address}</li>}
              {contactPhone && (
                <li>
                  <a
                    href={`https://wa.me/${contactPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-blue"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              {contactEmail && (
                <li>
                  <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-blue">
                    {contactEmail}
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              {["Instagram", "Facebook", "TikTok"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-dark text-dark transition-colors hover:border-blue hover:text-blue"
                >
                  <span className="text-2xs font-semibold uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div className="lg:col-span-2">
            <h2 className="mb-5 text-custom-xs font-semibold uppercase tracking-[0.16em] text-dark">
              Shop
            </h2>
            <ul className="flex flex-col gap-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-custom-sm text-body transition-colors hover:text-blue"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div className="lg:col-span-2">
            <h2 className="mb-5 text-custom-xs font-semibold uppercase tracking-[0.16em] text-dark">
              Information
            </h2>
            <ul className="flex flex-col gap-3">
              {INFO_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-custom-sm text-body transition-colors hover:text-blue"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h2 className="mb-5 text-custom-xs font-semibold uppercase tracking-[0.16em] text-dark">
              Newsletter
            </h2>
            <p className="mb-4 text-custom-sm leading-relaxed text-body">
              Sign up for exclusive offers, new arrivals and styling inspiration.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                name="footer-email"
                placeholder="Your email address"
                className="w-full border border-cream-dark bg-white px-4 py-3 text-custom-sm text-dark outline-none transition-colors placeholder:text-dark-4 focus:border-dark"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream-dark bg-cream">
        <div className="section-container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-2xs uppercase tracking-[0.14em] text-dark-4">
            &copy; {year} Chicbylims London. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Image src="/images/payment/payment-01.svg" alt="Visa" width={50} height={18} />
            <Image src="/images/payment/payment-03.svg" alt="Mastercard" width={28} height={20} />
            <Image src="/images/payment/payment-04.svg" alt="Apple Pay" width={44} height={18} />
            <Image src="/images/payment/payment-05.svg" alt="Google Pay" width={48} height={18} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
