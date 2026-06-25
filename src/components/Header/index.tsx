"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

import { useRouter, usePathname } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useSession } from "next-auth/react";

const AccountIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="fill-current" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25ZM4.75001 17.5C4.75001 16.6487 5.37139 15.7251 6.71085 14.9717C8.02681 14.2315 9.89529 13.75 12 13.75C14.1047 13.75 15.9732 14.2315 17.2892 14.9717C18.6286 15.7251 19.25 16.6487 19.25 17.5C19.25 18.8078 19.2097 19.544 18.5264 20.1004C18.1559 20.4022 17.5365 20.6967 16.4762 20.9113C15.4193 21.1252 13.9742 21.25 12 21.25C10.0258 21.25 8.58075 21.1252 7.5238 20.9113C6.46354 20.6967 5.84413 20.4022 5.4736 20.1004C4.79033 19.544 4.75001 18.8078 4.75001 17.5Z" />
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="fill-current" aria-hidden>
    <path d="M15.5433 9.5172C15.829 9.21725 15.8174 8.74252 15.5174 8.45686C15.2175 8.17119 14.7428 8.18277 14.4571 8.48272L12.1431 10.9125L11.5433 10.2827C11.2576 9.98277 10.7829 9.97119 10.483 10.2569C10.183 10.5425 10.1714 11.0173 10.4571 11.3172L11.6 12.5172C11.7415 12.6658 11.9378 12.75 12.1431 12.75C12.3483 12.75 12.5446 12.6658 12.6862 12.5172L15.5433 9.5172Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153C5.66124 5.29706 5.6648 5.33321 5.66809 5.36996L17.1203 5.36996C17.9389 5.36995 18.7735 5.36993 19.4606 5.44674C19.8103 5.48584 20.1569 5.54814 20.4634 5.65583C20.7639 5.76141 21.0942 5.93432 21.3292 6.23974C21.711 6.73613 21.7777 7.31414 21.7416 7.90034C21.7071 8.45845 21.5686 9.15234 21.4039 9.97723L21.3935 10.0295L21.3925 10.0341L20.8836 12.5033C20.7339 13.2298 20.6079 13.841 20.4455 14.3231C20.2731 14.8346 20.0341 15.2842 19.6076 15.6318C19.1811 15.9793 18.6925 16.1226 18.1568 16.1882C17.6518 16.25 17.0278 16.25 16.2862 16.25L10.8804 16.25C9.53464 16.25 8.44479 16.25 7.58656 16.1283C6.69032 16.0012 5.93752 15.7285 5.34366 15.1022C4.79742 14.526 4.50529 13.9144 4.35897 13.0601C4.22191 12.2598 4.20828 11.2125 4.20828 9.75996V7.03832C4.20828 6.29837 4.20726 5.80316 4.16611 5.42295C4.12678 5.0596 4.05708 4.87818 3.96682 4.74609C3.87876 4.61723 3.74509 4.4968 3.44186 4.34802C3.11902 4.18961 2.68026 4.03406 2.01266 3.79934L1.75145 3.7075C1.36068 3.57012 1.15527 3.14197 1.29266 2.7512ZM5.70828 6.86996L5.70828 9.75996C5.70828 11.249 5.72628 12.1578 5.83744 12.8068C5.93933 13.4018 6.11202 13.7324 6.43219 14.0701C6.70473 14.3576 7.08235 14.5418 7.79716 14.6432C8.53783 14.7482 9.5209 14.75 10.9377 14.75H16.2406C17.0399 14.75 17.5714 14.7487 17.9746 14.6993C18.3573 14.6525 18.5348 14.571 18.66 14.469C18.7853 14.3669 18.9009 14.2095 19.024 13.8441C19.1537 13.4592 19.2623 12.9389 19.4237 12.156L19.9225 9.73591L19.9229 9.73369C20.1005 8.84376 20.217 8.2515 20.2444 7.80793C20.2704 7.38648 20.2043 7.23927 20.1429 7.15786C20.1367 7.15259 20.0931 7.11565 19.9661 7.07101C19.8107 7.01639 19.5895 6.97049 19.2939 6.93745C18.6991 6.87096 17.9454 6.86996 17.089 6.86996H5.70828Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.2502 19.5C5.2502 20.7426 6.25756 21.75 7.5002 21.75C8.74285 21.75 9.7502 20.7426 9.7502 19.5C9.7502 18.2573 8.74285 17.25 7.5002 17.25C6.25756 17.25 5.2502 18.2573 5.2502 19.5ZM7.5002 20.25C7.08599 20.25 6.7502 19.9142 6.7502 19.5C6.7502 19.0857 7.08599 18.75 7.5002 18.75C7.91442 18.75 8.2502 19.0857 8.2502 19.5C8.2502 19.9142 7.91442 20.25 7.5002 20.25Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M14.25 19.5001C14.25 20.7427 15.2574 21.7501 16.5 21.7501C17.7426 21.7501 18.75 20.7427 18.75 19.5001C18.75 18.2574 17.7426 17.2501 16.5 17.2501C15.2574 17.2501 14.25 18.2574 14.25 19.5001ZM16.5 20.2501C16.0858 20.2501 15.75 19.9143 15.75 19.5001C15.75 19.0859 16.0858 18.7501 16.5 18.7501C16.9142 18.7501 17.25 19.0859 17.25 19.5001C17.25 19.9143 16.9142 20.2501 16.5 20.2501Z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="21" height="21" viewBox="0 0 16 16" fill="none" className="fill-current" aria-hidden>
    <path d="M5.97441 12.6073L6.43872 12.0183L5.97441 12.6073ZM7.99992 3.66709L7.45955 4.18719C7.60094 4.33408 7.79604 4.41709 7.99992 4.41709C8.2038 4.41709 8.3989 4.33408 8.54028 4.18719L7.99992 3.66709ZM10.0254 12.6073L10.4897 13.1962L10.0254 12.6073ZM6.43872 12.0183C5.41345 11.21 4.33627 10.4524 3.47904 9.48717C2.64752 8.55085 2.08325 7.47831 2.08325 6.0914H0.583252C0.583252 7.94644 1.3588 9.35867 2.35747 10.4832C3.33043 11.5788 4.57383 12.4582 5.51009 13.1962L6.43872 12.0183ZM2.08325 6.0914C2.08325 4.75102 2.84027 3.63995 3.85342 3.17683C4.81929 2.73533 6.15155 2.82823 7.45955 4.18719L8.54028 3.14699C6.84839 1.38917 4.84732 1.07324 3.22983 1.8126C1.65962 2.53035 0.583252 4.18982 0.583252 6.0914H2.08325ZM5.51009 13.1962C5.84928 13.4636 6.22932 13.7618 6.61834 13.9891C7.00711 14.2163 7.47619 14.4167 7.99992 14.4167V12.9167C7.85698 12.9167 7.65939 12.8601 7.37512 12.694C7.0911 12.5281 6.79171 12.2965 6.43872 12.0183L5.51009 13.1962ZM10.4897 13.1962C11.426 12.4582 12.6694 11.5788 13.6424 10.4832C14.641 9.35867 15.4166 7.94644 15.4166 6.0914H13.9166C13.9166 7.47831 13.3523 8.55085 12.5208 9.48717C11.6636 10.4524 10.5864 11.21 9.56112 12.0183L10.4897 13.1962ZM15.4166 6.0914C15.4166 4.18982 14.3402 2.53035 12.77 1.8126C11.1525 1.07324 9.15145 1.38917 7.45955 3.14699L8.54028 4.18719C9.84828 2.82823 11.1805 2.73533 12.1464 3.17683C13.1596 3.63995 13.9166 4.75102 13.9166 6.0914H15.4166ZM9.56112 12.0183C9.20813 12.2965 8.90874 12.5281 8.62471 12.694C8.34044 12.8601 8.14285 12.9167 7.99992 12.9167V14.4167C8.52365 14.4167 8.99273 14.2163 9.3815 13.9891C9.77052 13.7618 10.1506 13.4636 10.4897 13.1962L9.56112 12.0183Z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" />
  </svg>
);

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { currency, toDisplayAmount, symbol } = useCurrency();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery);
    if (params.toString()) {
      router.push(`/shop?${params.toString()}`);
      setNavigationOpen(false);
    }
  };

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const displayTotal = toDisplayAmount(totalPrice);

  // close mobile nav on route change
  useEffect(() => {
    setNavigationOpen(false);
  }, [pathname]);

  // Sticky shadow
  useEffect(() => {
    const handleStickyMenu = () => setStickyMenu(window.scrollY >= 40);
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`sticky top-0 z-9999 w-full bg-[#FBF9F5] transition-shadow duration-300 ease-out ${
        stickyMenu ? "shadow-sm" : ""
      }`}
    >
      {/* ===== Top bar ===== */}
      <div className="section-container">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 transition-all duration-200 xl:grid-cols-3 ${
            stickyMenu ? "py-3" : "py-4 xl:py-5"
          }`}
        >
          {/* Left: search (desktop) / hamburger (mobile) */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              aria-label={navigationOpen ? "Close menu" : "Open menu"}
              className="-ml-2 flex h-10 w-10 items-center justify-center text-dark xl:hidden"
              onClick={() => setNavigationOpen(!navigationOpen)}
            >
              <span className="relative block h-4 w-6">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    navigationOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-all duration-200 ${
                    navigationOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    navigationOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>

            <form onSubmit={handleSearch} className="hidden xl:block xl:w-full xl:max-w-[240px]">
              <div className="flex items-center gap-2 border-b border-dark/20 pb-1.5 focus-within:border-dark">
                <button type="submit" aria-label="Search" className="text-dark/60 hover:text-blue">
                  <SearchIcon />
                </button>
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  type="search"
                  name="search"
                  placeholder="Search"
                  autoComplete="off"
                  className="custom-search w-full border-0 bg-transparent p-0 text-custom-sm uppercase tracking-[0.1em] text-dark outline-none placeholder:text-dark-4"
                />
              </div>
            </form>
          </div>

          {/* Center: wordmark */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              aria-label="Chibylims home"
              className="font-serif text-[26px] font-semibold uppercase leading-none tracking-[0.25em] text-dark sm:text-[30px] xl:text-[34px]"
            >
              Chibylims
            </Link>
          </div>

          {/* Right: account / wishlist / cart */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Link
              href={session ? "/my-account" : "/signin"}
              aria-label={session ? "My account" : "Sign in"}
              className="hidden h-10 w-10 items-center justify-center text-dark transition-colors hover:text-blue sm:flex"
            >
              <AccountIcon />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center text-dark transition-colors hover:text-blue sm:flex"
            >
              <HeartIcon />
            </Link>
            <button
              type="button"
              onClick={openCartModal}
              aria-label={`Cart, ${product.length} items, ${symbol}${formatPrice(displayTotal, currency)}`}
              className="relative flex h-10 w-10 items-center justify-center text-dark transition-colors hover:text-blue"
            >
              <CartIcon />
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-blue px-0.5 text-2xs font-medium text-white">
                {product.length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <form onSubmit={handleSearch} className="pb-3 xl:hidden">
          <div className="flex items-center gap-2 border border-cream-dark bg-white px-3 py-2">
            <button type="submit" aria-label="Search" className="text-dark/60">
              <SearchIcon />
            </button>
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              type="search"
              name="search-mobile"
              placeholder="Search products"
              autoComplete="off"
              className="custom-search w-full border-0 bg-transparent p-0 text-custom-sm text-dark outline-none placeholder:text-dark-4"
            />
          </div>
        </form>
      </div>

      {/* ===== Nav row ===== */}
      <div className="border-t border-cream-dark">
        <div className="section-container">
          {/* Desktop nav */}
          <nav className="hidden xl:block">
            <ul className="flex items-center justify-center gap-9">
              {menuData.map((menuItem, i) =>
                menuItem.submenu ? (
                  <Dropdown key={i} menuItem={menuItem} stickyMenu={stickyMenu} />
                ) : (
                  <li
                    key={i}
                    className="group relative before:absolute before:left-0 before:top-0 before:h-[2px] before:w-0 before:rounded-b before:bg-blue before:duration-200 before:ease-out hover:before:w-full"
                  >
                    <Link
                      href={menuItem.path ?? "/"}
                      className={`flex text-custom-xs font-medium uppercase tracking-[0.16em] text-dark transition-colors hover:text-blue ${
                        stickyMenu ? "py-3.5" : "py-4"
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile nav drawer */}
        <div
          className={`overflow-hidden bg-white transition-[max-height] duration-300 ease-out xl:hidden ${
            navigationOpen ? "max-h-[480px] border-t border-cream-dark" : "max-h-0"
          }`}
        >
          <nav className="section-container py-4">
            <ul className="flex flex-col">
              {menuData.map((menuItem, i) => (
                <li key={i} className="border-b border-cream-dark/70 last:border-0">
                  <Link
                    href={menuItem.path ?? "/"}
                    className="flex py-3 text-custom-sm font-medium uppercase tracking-[0.14em] text-dark"
                    onClick={() => setNavigationOpen(false)}
                  >
                    {menuItem.title}
                  </Link>
                  {menuItem.submenu && (
                    <ul className="-mt-1 flex flex-col gap-1 pb-3 pl-3">
                      {menuItem.submenu.map((sub, j) => (
                        <li key={j}>
                          <Link
                            href={sub.path ?? "/"}
                            className="flex py-1.5 text-custom-sm text-dark-3 hover:text-blue"
                            onClick={() => setNavigationOpen(false)}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="flex items-center gap-6 pt-4">
                <Link href={session ? "/my-account" : "/signin"} className="flex items-center gap-2 text-custom-sm text-dark" onClick={() => setNavigationOpen(false)}>
                  <AccountIcon /> {session ? "Account" : "Sign in"}
                </Link>
                <Link href="/wishlist" className="flex items-center gap-2 text-custom-sm text-dark" onClick={() => setNavigationOpen(false)}>
                  <HeartIcon /> Wishlist
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
