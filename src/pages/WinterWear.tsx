import { useState, useEffect } from "react";
import CollectionLayout from "@/components/CollectionLayout";
import { normalizeProduct } from "@/lib/normalizeProduct";
import { useBanner } from "@/hooks/useBanner";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function WinterWear() {
  const [winterProducts, setWinterProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { banner } = useBanner("winter_collection");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.products || [])
            .filter((p: any) => p.isWinter)
            .map((p: any) => normalizeProduct(p));
          setWinterProducts(mapped);
        } else {
          setWinterProducts([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching products:", errorMessage);
        setWinterProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <CollectionLayout
      title="Winter Wear"
      subtitle="Cozy & Stylish Winter Fits"
      tagline="Warm Elegance for the Cold Season"
      metaTitle="Winter Wear | Vasstra - Cozy Winter Fashion"
      metaDescription="Shop our winter collection. Warm fabrics, rich colors, and stylish winter outfits. Free shipping above ₹999."
      products={winterProducts}
      bannerImage={banner?.imageUrl || "https://images.unsplash.com/photo-1612395805620-f5b31f3fbb80?w=1600&q=80&fit=crop"}
      bannerBgColor="bg-gradient-to-br from-slate/15 via-accent/5 to-background"
    />
  );
}
