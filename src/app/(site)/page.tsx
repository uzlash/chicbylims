import Home from "@/components/Home";
import { Metadata } from "next";
import {
  getNewArrivalProducts,
  getFeaturedProducts,
  getAllCategories,
  getTestimonials,
  getHomePageHero,
} from "@/lib/sanity.queries";
import {
  sanityProductsToProducts,
  sanityCategoriesToCategories,
  sanityTestimonialsToTestimonials,
  sanityProductToProduct,
} from "@/lib/sanityHelpers";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chibylims | Fabrics Store",
  description: "Shop wax fabrics, lace and premium fabrics.",
};

export default async function HomePage() {
  const brandSlug = "fabrics";

  const [newArrivals, featured, categories, testimonials, heroData] =
    await Promise.all([
      getNewArrivalProducts(8, brandSlug),
      getFeaturedProducts(8, brandSlug),
      getAllCategories(brandSlug),
      getTestimonials(brandSlug),
      getHomePageHero(brandSlug),
    ]);

  const newArrivalProducts = sanityProductsToProducts(newArrivals || []);
  const featuredProducts = sanityProductsToProducts(featured || []);
  const allCategories = sanityCategoriesToCategories(categories || []);
  const allTestimonials = sanityTestimonialsToTestimonials(testimonials || []);

  const heroCarousel = (heroData?.heroCarousel || [])
    .filter(Boolean)
    .map(sanityProductToProduct);
  const heroSmallCard1 = heroData?.heroSmallCard1
    ? sanityProductToProduct(heroData.heroSmallCard1)
    : null;
  const heroSmallCard2 = heroData?.heroSmallCard2
    ? sanityProductToProduct(heroData.heroSmallCard2)
    : null;

  const promoBig = heroData?.promoBigCard
    ? sanityProductToProduct(heroData.promoBigCard)
    : null;
  const promoMedium1 = heroData?.promoMediumCard1
    ? sanityProductToProduct(heroData.promoMediumCard1)
    : null;
  const promoMedium2 = heroData?.promoMediumCard2
    ? sanityProductToProduct(heroData.promoMediumCard2)
    : null;
  const countdownProduct = heroData?.countdownProduct
    ? sanityProductToProduct(heroData.countdownProduct)
    : null;
  const countdownDeadline = heroData?.countdownDeadline ?? null;

  return (
    <Home
      newArrivals={newArrivalProducts}
      featured={featuredProducts}
      categories={allCategories}
      testimonials={allTestimonials}
      heroCarousel={heroCarousel}
      heroSmallCard1={heroSmallCard1}
      heroSmallCard2={heroSmallCard2}
      promoBig={promoBig}
      promoMedium1={promoMedium1}
      promoMedium2={promoMedium2}
      countdownProduct={countdownProduct}
      countdownDeadline={countdownDeadline}
    />
  );
}
