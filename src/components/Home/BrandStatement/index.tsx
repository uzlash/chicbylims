import React from "react";

interface Props {
  text?: string;
}

const BrandStatement = ({
  text = "Discover our authentic, ready-to-wear African clothing — designed to make you feel unique and unapologetic.",
}: Props) => {
  return (
    <section className="pt-20 xl:pt-28">
      <div className="section-container">
        <div className="mx-auto max-w-[860px] border-y border-cream-dark py-14 text-center xl:py-20">
          <p className="heading-serif text-display-3 text-dark">{text}</p>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
