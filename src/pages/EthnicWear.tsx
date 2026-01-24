import { useState, useEffect } from "react";
import CollectionLayout from "@/components/CollectionLayout";
import { ethnicSubcategories } from "@/data/products";
import { normalizeProduct } from "@/lib/normalizeProduct";
import { useBanner } from "@/hooks/useBanner";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function EthnicWear() {
  const [ethnicProducts, setEthnicProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { banner } = useBanner("ethnic_wear");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const url = `${API_URL}/products?category=ethnic_wear`;
        console.log('Fetching ethnic wear products from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`API Error: ${response.status} ${response.statusText}`);
          setEthnicProducts([]);
          return;
        }

        const data = await response.json();
        const mapped = (data.products || []).map((p: any) => normalizeProduct(p));
        setEthnicProducts(mapped);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching ethnic wear products:", errorMessage);
        if (error instanceof TypeError) {
          console.error("Network error - API may be unreachable at:", API_URL);
        }
        setEthnicProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterCategories = ethnicSubcategories.map(s => s.name);

  return (
    <CollectionLayout
      title="Ethnic Wear Collection"
      subtitle="Timeless Elegance Meets Contemporary Design"
      tagline="Traditional Fashion Reimagined"
      metaTitle="Ethnic Wear | Vasstra - Premium Indian Fashion"
      metaDescription="Explore our exclusive ethnic wear collection. Shop kurta sets, anarkali suits, lehengas, and festive wear with free shipping above ₹999."
      products={ethnicProducts}
      filterCategories={filterCategories}
      bannerImage={banner?.imageUrl || "https://images.unsplash.com/photo-1610706406159-b21bd25c5e9c?w=1600&q=80&fit=crop"}
      bannerBgColor="bg-gradient-to-br from-burgundy/15 via-gold/5 to-background"
    />
  );
}
