import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CollectionBanner from "@/components/CollectionBanner";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/data/products";
import { normalizeProduct } from "@/lib/normalizeProduct";
import { useBanner } from "@/hooks/useBanner";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { banner } = useBanner("new_arrivals");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.success || data.products) {
          const filtered = (data.products || []).filter((p: any) => p.isNewProduct || p.isNew);
          const mapped = filtered.map((p: any) => normalizeProduct(p));
          setProducts(mapped);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching products:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>New Arrivals | Vasstra</title>
        <meta name="description" content="Explore our new arrivals - freshly curated ethnic wear collection with latest designs and trends" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Collection Banner */}
          <CollectionBanner
            title="New Arrivals"
            subtitle="Fresh & Latest Designs"
            tagline="Exclusively Curated for You"
            backgroundImage={banner?.imageUrl || "https://images.unsplash.com/photo-1626327957914-28bfbf68a57d?w=1600&q=80&fit=crop"}
            backgroundColor="bg-gradient-to-br from-gold/15 via-accent/5 to-background"
            productCount={products.length}
          />

          <div className="container mx-auto px-4 py-12 md:py-16">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading new arrivals...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No new arrivals at the moment. Check back soon!</p>
              </div>
            ) : (
              <ProductCarousel
                products={products}
                itemsPerView={4}
              />
            )}
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}
