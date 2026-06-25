import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  if (!testimonial.screenshotUrl) return null;

  return (
    <div className="flex w-full flex-col">
      <div className="relative w-full overflow-hidden border border-cream-dark bg-cream">
        <Image
          src={testimonial.screenshotUrl}
          alt={testimonial.caption || "Customer review"}
          width={600}
          height={800}
          className="block h-auto w-full"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {testimonial.caption && (
        <p className="mt-3 w-full text-center text-custom-sm text-body">{testimonial.caption}</p>
      )}
    </div>
  );
};

export default SingleItem;
