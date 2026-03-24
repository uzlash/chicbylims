import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { getProductBySlug, getSiteSettings } from "@/lib/sanity.queries";
import { sanityProductToProduct } from "@/lib/sanityHelpers";
import { urlFor } from "@/lib/sanity.image";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const sanityProduct = await getProductBySlug(slug);
  
  if (!sanityProduct) {
    return {
      title: "Product Not Found | NextCommerce",
    };
  }

  const ogImage = sanityProduct.images?.[0]
    ? urlFor(sanityProduct.images[0]).width(1200).height(630).url()
    : undefined;

  return {
    title: `${sanityProduct.name} | NextCommerce`,
    description: sanityProduct.description || `Buy ${sanityProduct.name} at NextCommerce`,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
  };
}

export const revalidate = 60;

const ShopDetailsPage = async ({ params }: Props) => {
  const { slug } = await params;
  const [sanityProduct, siteSettings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!sanityProduct) {
    return (
      <main>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </main>
    );
  }

  const product = sanityProductToProduct(sanityProduct);

  return (
    <main>
      <ShopDetails product={product} siteContactPhone={siteSettings?.contactPhone} />
    </main>
  );
};

export default ShopDetailsPage;
