"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const AdminHeader = ({ user }: { user: any }) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              {/* Search Input */}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xl:gap-7">
          <ul className="flex items-center gap-2 2xl:gap-4">
            {/* Notification Menu Area */}
          </ul>

          {/* User Area */}
          <div className="relative">
            <Link className="flex items-center gap-4" href="#">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                  {user?.name}
                </span>
                <span className="block text-xs">Admin</span>
              </span>

              <span className="h-12 w-12 rounded-full">
                <Image
                  width={112}
                  height={112}
                  src={user?.image || "/images/users/user-01.jpg"}
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                  alt="User"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
