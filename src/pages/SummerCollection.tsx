import { useState, useEffect } from "react";
import CollectionLayout from "@/components/CollectionLayout";
import { normalizeProduct } from "@/lib/normalizeProduct";
import { useBanner } from "@/hooks/useBanner";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SummerCollection() {
  const [summerProducts, setSummerProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { banner } = useBanner("summer_collection");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.products || [])
            .filter((p: any) => p.isSummer)
            .map((p: any) => normalizeProduct(p));
          setSummerProducts(mapped);
        } else {
          setSummerProducts([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching products:", errorMessage);
        setSummerProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <CollectionLayout
      title="Summer Collection"
      subtitle="Light • Breezy • Comfortable"
      tagline="Stay Cool in Style This Summer"
      metaTitle="Summer Collection | Vasstra - Light & Breezy Fashion"
      metaDescription="Shop our summer collection. Light fabrics, bright colors, and breathable outfits perfect for the season. Free shipping above ₹999."
      products={summerProducts}
      bannerImage={banner?.imageUrl || "https://images.unsplash.com/photo-1490481651971-daf3e7b5ca75?w=1600&q=80&fit=crop"}
      bannerBgColor="bg-gradient-to-br from-yellow/15 via-accent/5 to-background"
    />
  );
}
