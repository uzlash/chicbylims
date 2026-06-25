"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import { Testimonial } from "@/types/testimonial";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const sliderRef = useRef(null);
  const validTestimonials = testimonials.filter((t) => t.screenshotUrl);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  if (validTestimonials.length === 0) return null;

  return (
    <section className="overflow-hidden pt-20 xl:pt-28">
      <div className="section-container">
        <div className="">
          <div className="swiper testimonial-carousel common-carousel">
            {/* <!-- section title --> */}
            <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <span className="flex items-center gap-1 text-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                      <path d="M12 2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.98 6.09 20.16l1.13-6.57L2.45 8.94l6.6-.96L12 2z" />
                    </svg>
                  ))}
                </span>
                <h2 className="heading-serif mt-3 text-display-3">Let customers speak for us</h2>
                <p className="mt-2 text-custom-sm text-body">From 700+ happy customers</p>
              </div>

              <div className="flex items-center gap-3">
                <div onClick={handlePrev} className="swiper-button-prev">
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                      fill=""
                    />
                  </svg>
                </div>

                <div onClick={handleNext} className="swiper-button-next">
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                      fill=""
                    />
                  </svg>
                </div>
              </div>
            </div>

            <Swiper
              ref={sliderRef}
              autoHeight
              slidesPerView={3}
              spaceBetween={20}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                1000: {
                  slidesPerView: 2,
                },
                1200: {
                  slidesPerView: 3,
                },
              }}
            >
              {validTestimonials.map((item, key) => (
                  <SwiperSlide key={item.id ?? key}>
                    <SingleItem testimonial={item} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
