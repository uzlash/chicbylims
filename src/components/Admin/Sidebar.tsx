"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0">
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/admin" className="text-white text-2xl font-bold">
          Admin Panel
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/admin"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                    pathname === "/admin" && "bg-graydark"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                    pathname.includes("/admin/orders") && "bg-graydark"
                  }`}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                    pathname.includes("/admin/products") && "bg-graydark"
                  }`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/customers"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                    pathname.includes("/admin/customers") && "bg-graydark"
                  }`}
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  href="/studio"
                  target="_blank"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark`}
                >
                  Sanity Studio
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
