import { useState, useEffect } from "react";

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  category: string;
  isActive: boolean;
  order: number;
}

export function useBanner(category: string) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_URL}/banners/category/${category}`);

        if (response.ok) {
          const data = await response.json();
          if (data.banners && data.banners.length > 0) {
            // Get the first banner for the category
            setBanner(data.banners[0]);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error fetching banner for category ${category}:`, errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, [category]);

  return { banner, isLoading };
}
