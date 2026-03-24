import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  if (!testimonial.screenshotUrl) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full rounded-[10px] overflow-hidden bg-gray-1">
        <Image
          src={testimonial.screenshotUrl}
          alt={testimonial.caption || "WhatsApp chat testimonial"}
          width={600}
          height={800}
          className="w-full h-auto block"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {testimonial.caption && (
        <p className="text-custom-sm text-dark-5 mt-2 text-center w-full">
          {testimonial.caption}
        </p>
      )}
    </div>
  );
};

export default SingleItem;
