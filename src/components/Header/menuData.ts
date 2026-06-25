import { Menu } from "@/types/Menu";

// CUMO-style editorial navigation. Top-level lands on /shop (optionally filtered by
// ?category=), dropdowns group sub-collections. Labels are generic where no matching
// Sanity category exists yet — adjust paths to real category slugs as the catalog grows.
export const menuData: Menu[] = [
  {
    id: 1,
    title: "Shop All",
    newTab: false,
    path: "/shop",
  },
  {
    id: 2,
    title: "Wedding Guests",
    newTab: false,
    path: "/shop?category=wedding-guests",
  },
  {
    id: 3,
    title: "Women",
    newTab: false,
    path: "/shop?category=women",
    submenu: [
      { id: 31, title: "Dresses", newTab: false, path: "/shop?category=dresses" },
      { id: 32, title: "Tops & Blouses", newTab: false, path: "/shop?category=tops" },
      { id: 33, title: "Skirts", newTab: false, path: "/shop?category=skirts" },
      { id: 34, title: "Trousers", newTab: false, path: "/shop?category=trousers" },
      { id: 35, title: "Matching Sets", newTab: false, path: "/shop?category=matching-sets" },
      { id: 36, title: "Headpieces", newTab: false, path: "/shop?category=headpieces" },
    ],
  },
  {
    id: 4,
    title: "Men",
    newTab: false,
    path: "/shop?category=men",
    submenu: [
      { id: 41, title: "Shirts", newTab: false, path: "/shop?category=shirts" },
      { id: 42, title: "Trousers", newTab: false, path: "/shop?category=mens-trousers" },
      { id: 43, title: "Matching Sets", newTab: false, path: "/shop?category=mens-sets" },
      { id: 44, title: "Bomber Jackets", newTab: false, path: "/shop?category=bomber-jackets" },
    ],
  },
  {
    id: 5,
    title: "Final Clearance",
    newTab: false,
    path: "/shop?category=clearance",
  },
  {
    id: 6,
    title: "Info",
    newTab: false,
    path: "/contact",
    submenu: [
      { id: 61, title: "About Us", newTab: false, path: "/contact" },
      { id: 62, title: "Contact Us", newTab: false, path: "/contact" },
      { id: 63, title: "Shipping & Returns", newTab: false, path: "/contact" },
      { id: 64, title: "Sizing Chart", newTab: false, path: "/contact" },
      { id: 65, title: "FAQs", newTab: false, path: "/contact" },
    ],
  },
];
