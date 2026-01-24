import { useState, useEffect } from "react";
import CollectionLayout from "@/components/CollectionLayout";
import { westernSubcategories } from "@/data/products";
import { normalizeProduct } from "@/lib/normalizeProduct";
import { useBanner } from "@/hooks/useBanner";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function WesternWear() {
  const [westernProducts, setWesternProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { banner } = useBanner("western_wear");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const url = `${API_URL}/products?category=western_wear`;
        console.log('Fetching western wear products from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`API Error: ${response.status} ${response.statusText}`);
          setWesternProducts([]);
          return;
        }

        const data = await response.json();
        const mapped = (data.products || []).map((p: any) => normalizeProduct(p));
        setWesternProducts(mapped);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching western wear products:", errorMessage);
        if (error instanceof TypeError) {
          console.error("Network error - API may be unreachable at:", API_URL);
        }
        setWesternProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterCategories = westernSubcategories.map(s => s.name);

  return (
    <CollectionLayout
      title="Modern Western Styles"
      subtitle="Contemporary Fashion for the Modern Woman"
      tagline="Modern Elegance"
      metaTitle="Western Wear | Vasstra - Modern Fashion"
      metaDescription="Shop our western wear collection. Trendy tops, dresses, co-ord sets, and casual wear. Free shipping above ₹999."
      products={westernProducts}
      filterCategories={filterCategories}
      bannerImage={banner?.imageUrl || "https://images.unsplash.com/photo-1595592834986-c67ee1dbe3d5?w=1600&q=80&fit=crop"}
      bannerBgColor="bg-gradient-to-br from-secondary/15 via-accent/5 to-background"
    />
  );
}
