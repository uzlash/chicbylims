import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="border-b border-cream-dark bg-cream">
      <div className="section-container py-10 xl:py-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <ul className="flex items-center gap-1.5 text-custom-xs uppercase tracking-[0.16em] text-dark-4">
            <li>
              <Link href="/" className="transition-colors hover:text-blue">
                Home
              </Link>
            </li>
            {pages.length > 0 &&
              pages.map((page, key) => (
                <li key={key} className="flex items-center gap-1.5 capitalize last:text-dark">
                  <span className="text-dark-5">/</span>
                  {page}
                </li>
              ))}
          </ul>

          <h1 className="heading-serif text-display-3">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
