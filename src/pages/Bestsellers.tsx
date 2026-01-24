import { useState, useEffect } from "react";
import CollectionLayout from "@/components/CollectionLayout";
import { normalizeProduct } from "@/lib/normalizeProduct";
import { useBanner } from "@/hooks/useBanner";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Bestsellers() {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { banner } = useBanner("bestsellers");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.products || [])
            .filter((p: any) => p.isBestseller)
            .map((p: any) => normalizeProduct(p));
          setBestsellers(mapped);
        } else {
          setBestsellers([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching products:", errorMessage);
        setBestsellers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <CollectionLayout
      title="Bestsellers"
      subtitle="Bestselling Outfits Loved by Customers"
      tagline="Customer Favorites"
      metaTitle="Bestsellers | Vasstra - Top Selling Ethnic Fashion"
      metaDescription="Shop our bestselling ethnic wear collection. Customer favorites with premium quality and stunning designs. Free shipping above ₹999."
      products={bestsellers}
      showTrending
      bannerImage={banner?.imageUrl || "https://images.unsplash.com/photo-1595777712802-14b700b0535e?w=1600&q=80&fit=crop"}
      bannerBgColor="bg-gradient-to-br from-primary/15 via-accent/5 to-background"
    />
  );
}
